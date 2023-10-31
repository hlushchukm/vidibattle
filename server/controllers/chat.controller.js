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
    const { chatId } = req.params;
    let { pageSize, lastDate, lastMessageId } = req.query;

    if (!pageSize) pageSize = 10;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const messages = await Message.chatList({
      chatId,
      lastDate,
      lastMessageId,
      pageSize,
    });

    const chat = await Chat.findById(chatId, "participants");

    // check if the person making the request is in the chat participants lists
    const { _id } = req.user;
    if (!chat.participants.includes(_id)) {
      return res
        .status(403)
        .json({ message: "can't access this user's chats" });
    }

    await chat.populate({
      path: "participants",
      select: "first_name last_name bio profile_img",
    });

    res.json({ data: { messages: messages.reverse(), chat } });
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
  await message.populate("sender", "first_name last_name profile_img");
  await message.populate("receiver", "first_name last_name profile_img");

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
