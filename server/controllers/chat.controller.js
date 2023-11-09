const { default: mongoose } = require("mongoose");
const { Chat } = require("../models/chat.model");
const { Message } = require("../models/message.model");
const { User } = require("../models/user.model");

module.exports.getChatList = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // check if the userId is the same as the person making this request
    const { _id } = req.user;
    if (_id !== userId) {
      return res
        .status(403)
        .json({ message: "can't access this user's chats" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // TODO: currently if a user is blocked by another person, the blocked person can access the message, only the blocker can't see it
    const populatedUser = await user.populate({
      path: "chats",
      match: { participants: { $nin: user.blocked_users } }, // exclude chats with blocked users
      populate: {
        path: "participants",
        select: "first_name last_name profile_img",
      },
      options: {
        populate: {
          path: "messages",
          options: {
            limit: 1, // Limit to only retrieve the last message
            sort: { createdAt: -1 }, // Sort messages in descending order based on createdAt
          },
        },
      },
    });

    // TODO: sort the chats and make the last updated one appear on top
    res.json({ data: populatedUser.chats, count: populatedUser.chats_count });
  } catch (e) {
    next(e);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { pageSize = 10, lastDate, lastMessageId } = req.query;
    const currentUserId = req.user._id;

    // Check if the current user has blocked the specified user
    const currentUser = await User.findById(currentUserId).exec();
    if (!currentUser) {
      return res.status(404).json({ message: "requesting user not found" });
    }
    if (currentUser.blocked_users.includes(userId)) {
      return res.status(403).json({ message: "Can't access this chat" });
    }

    // Check if the specified user has blocked the current user
    const specifiedUser = await User.findById(userId).exec();
    if (!specifiedUser) {
      return res.status(404).json({ message: "requested user not found" });
    }
    if (specifiedUser.blocked_users.includes(currentUserId)) {
      return res
        .status(403)
        .json({ message: "Access denied. This user has blocked you." });
    }

    // get the chat both users participate in
    const chat = await Chat.findOne(
      {
        participants: { $all: [currentUserId, userId] },
      },
      "participants"
    ).exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
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
      select: "first_name last_name bio profile_img",
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
