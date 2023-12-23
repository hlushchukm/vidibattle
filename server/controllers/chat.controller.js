const { default: mongoose } = require("mongoose");
const { Chat } = require("../models/chat.model");
const { Message } = require("../models/message.model");
const { User } = require("../models/user.model");

// Old code to get a list of chats
// module.exports.getChatList = async (req, res, next) => {
//   try {
//     const { userId } = req.params;

//     // check if the userId is the same as the person making this request
//     const { _id } = req.user;
//     if (_id !== userId) {
//       return res
//         .status(403)
//         .json({ message: "can't access this user's chats" });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const populatedUser = await user.populate({
//       path: "chats",
//       match: { participants: { $nin: user.blocked_users } }, // exclude chats with blocked users
//       populate: {
//         path: "participants",
//         select: "first_name last_name profile_img",
//       },
//       options: {
//         populate: {
//           path: "messages",
//           options: {
//             limit: 1, // Limit to only retrieve the last message
//             sort: { createdAt: -1 }, // Sort messages in descending order based on createdAt
//           },
//         },
//       },
//     });

//     res.json({ data: populatedUser.chats, count: populatedUser.chats_count });
//   } catch (e) {
//     next(e);
//   }
// };

module.exports.getChatList = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchString = req.query.searchString || "";

    // Get the requesting user's following list
    const user = await User.findById(userId).populate(
      "following",
      "first_name last_name profile_img username"
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Get the chats of the requesting user
    const chats = await Chat.find({ participants: { $in: [userId] } }).populate(
      {
        path: "participants",
        select: "first_name last_name profile_img username",
      }
    );

    // Create an array to store the unique contacts
    const contacts = [];

    // Iterate over the chats to find unique contacts
    for (const chat of chats) {
      const otherParticipants = chat.participants.filter(
        (participant) => participant._id.toString() !== userId
      );
      if (
        otherParticipants[0] &&
        !user.blocked_users?.includes(otherParticipants[0]?._id) &&
        !user.blocked_by?.includes(otherParticipants[0]?._id)
      ) {
        const contact = {
          user: otherParticipants[0],
          chatId: chat._id,
        };
        contacts.push(contact);
      }
    }

    // Iterate over the following list to find unique contacts
    for (const following of user.following) {
      const existingContact = contacts.find(
        (contact) => contact.user._id.toString() === following._id.toString()
      );
      if (
        !existingContact &&
        !user.blocked_users?.includes(following._id) &&
        !user.blocked_by?.includes(following._id)
      ) {
        const contact = {
          user: following,
          chatId: null,
        };
        contacts.push(contact);
      }
    }

    let filteredContacts = contacts;

    if (searchString.length > 0) {
      // Filter contacts based on search string

      let splittedString = searchString;
      if (splittedString[0] === "@") {
        splittedString = splittedString.slice(1);
      }
      splittedString = splittedString.trim().toLowerCase().split(" ");

      filteredContacts = contacts.filter(
        (contact) =>
          contact.user.username.toLowerCase().includes(splittedString[0]) ||
          contact.user.first_name.toLowerCase().includes(splittedString[0]) ||
          contact.user.last_name
            .toLowerCase()
            .includes(splittedString[1] ? splittedString[1] : splittedString[0])
      );

      // search non followers
      const regex1 = new RegExp(
        splittedString[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        "i"
      );

      let regex2;
      if (splittedString[1]) {
        regex2 = new RegExp(
          splittedString[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
          "i"
        );
      }

      const query = {
        $or: [
          { username: regex1 },
          { first_name: regex1 },
          { last_name: regex2 ? regex2 : regex1 },
        ],
        _id: {
          $nin: [user._id, ...user.blocked_users, ...user.blocked_by],
        },
      };

      const matches = await User.find(
        query,
        "first_name last_name profile_img username"
      )
        .skip((page - 1) * limit)
        .limit(limit);

      // Iterate over the matches to find unique contacts
      for (const person of matches) {
        const existingContact = filteredContacts.find(
          (contact) => contact.user._id.toString() === person._id.toString()
        );
        if (!existingContact) {
          const contact = {
            user: person,
            chatId: null,
          };
          filteredContacts.push(contact);
        }
      }
    }

    // Sort the contacts by their last message timestamp (if chat exists)
    for (const contact of filteredContacts) {
      if (contact.chatId) {
        const lastMessage = await Message.findOne({
          chat_id: contact.chatId,
        }).sort({ createdAt: -1 });
        if (lastMessage) {
          contact.lastMessage = lastMessage;
        }
      }
    }

    // Paginate the contacts array
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    // Send the paginated contacts as the API response
    res.status(200).json({ data: paginatedContacts, page: page });
  } catch (e) {
    next(e);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { username } = req.params;
    let { pageSize = 10, lastDate, lastMessageId } = req.query;
    const currentUserId = req.user._id;

    const specifiedUser = await User.findOne({ username }).exec();
    if (!specifiedUser) {
      return res.status(404).json({ message: "requested user not found" });
    }

    // Check if the current user has blocked the specified user
    const currentUser = await User.findById(currentUserId).exec();
    if (!currentUser) {
      return res.status(404).json({ message: "requesting user not found" });
    }
    if (currentUser.blocked_users.includes(specifiedUser._id)) {
      return res.status(403).json({ message: "Can't access this chat" });
    }

    // Check if the specified user has blocked the current user
    if (specifiedUser.blocked_users.includes(currentUserId)) {
      return res
        .status(403)
        .json({ message: "Access denied. This user has blocked you." });
    }

    // get the chat both users participate in
    const chat = await Chat.findOne(
      {
        participants: { $all: [currentUserId, specifiedUser._id] },
      },
      "participants"
    ).exec();

    if (!chat) {
      return res.json({
        data: {
          messages: [],
          chat,
          receiver: {
            _id: specifiedUser._id,
            first_name: specifiedUser.first_name,
            last_name: specifiedUser.last_name,
            profile_img: specifiedUser.profile_img,
            username: specifiedUser.username,
          },
          lastDate: lastDate,
          lastMessageId: lastMessageId,
        },
      });
    }

    // get the messages in the chat
    let query = Message.find({ chat_id: chat._id }).sort({ createdAt: -1 });

    // paginate the messages
    if (lastMessageId && lastDate) {
      query = query.or([
        { createdAt: { $lt: new Date(lastDate) } },
        {
          $and: [
            { createdAt: new Date(lastDate) },
            { _id: { $lt: new mongoose.Types.ObjectId(lastMessageId) } },
          ],
        },
      ]);
    }
    query = query.limit(parseInt(pageSize) || 10).exec();

    const messages = await query;

    // get participants info from the chat
    await chat.populate({
      path: "participants",
      select: "first_name last_name bio profile_img username",
    });

    let updatedLastDate = lastDate;
    let updatedLastMessageId = lastMessageId;

    if (messages.length > 0) {
      updatedLastDate = messages[messages.length - 1].createdAt.toISOString();
      updatedLastMessageId = messages[messages.length - 1]._id.toString();
    }

    res.json({
      data: {
        messages: messages.reverse(),
        chat,
        receiver: {
          _id: specifiedUser._id,
          first_name: specifiedUser.first_name,
          last_name: specifiedUser.last_name,
          profile_img: specifiedUser.profile_img,
          username: specifiedUser.username,
        },
        lastDate: updatedLastDate,
        lastMessageId: updatedLastMessageId,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports.sendMessage = async (req, res, next) => {
  try {
    const { sender, receiver, content, chatId } = req.body;
    if (!sender || !receiver || !content) {
      return res.status(400).json({
        status: false,
        message: "missing data! sender, receiver and content is needed",
      });
    }

    const newMsg = await msgCreator({ sender, receiver, content, chatId });
    return res.status(201).json({
      message: "Message Sent",
      data: newMsg.message,
      chat_id: newMsg.chat._id,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.createMessage = async ({
  chatId,
  sender,
  receiver,
  content,
}) => {
  return await msgCreator({
    chatId,
    sender,
    receiver,
    content,
  });
};

async function msgCreator({ chatId, sender, receiver, content }) {
  let chat;
  if (!chatId) {
    // if chat doesn't exist, create one
    chat = await createChat([sender, receiver]);
  } else {
    chat = await Chat.findById(chatId);
  }

  const message = new Message({
    sender,
    receiver,
    content,
    chat_id: chat._id,
  });

  await message.save();

  chat.messages.push(message._id);
  await chat.save();

  return {
    message,
    chat,
  };
}

async function createChat(participants) {
  try {
    const chat = new Chat({
      participants,
    });

    await chat.save();

    for (let i = 0; i < participants.length; i++) {
      await User.addChat(participants[i], chat._id);
    }

    return chat;
  } catch (e) {
    throw new Error(e);
  }
}
