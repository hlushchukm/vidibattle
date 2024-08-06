const socketio = require("socket.io");
const { createMessage } = require("../controllers/chat.controller");
const { User } = require("../models/user.model");
const { Message } = require("../models/message.model");

const websocket = (io) => {
  

  // Socket.IO
  io.on("connection", async (socket) => {
    console.log(JSON.stringify(socket.handshake.query));    
    const user_id = socket.handshake.query["user_id"];    
      
    if (user_id != null && Boolean(user_id)) {
      try {        
        await User.updateOne(
          { _id: user_id },
          { $set: {
             socket_id: socket.id,
            is_active: true, 
          } }
        );
        io.emit("USER_STATUS", { user_id, is_active: true });     
      } catch (e) {
        console.log(e);
      }
    }

    socket.on("SEND_MESSAGE", async (message) => {      
      const { chatId, sender, receiver, content, attachment } = message;
      if (!sender || !receiver || !content && !attachment) {
        return;
      }
      const newMsg = await createMessage({ chatId, sender, receiver, content, attachment });
      
      io.emit("INCOMING_MESSAGE", {
        sender,
        receiver,        
        message: newMsg.message,
        chat_id: newMsg.chat._id,
      });
    });

    socket.on("MESSAGE_SEEN", async (messageId) => {      
      if (!messageId) {
        return;
      }
      const message = await Message.findByIdAndUpdate(messageId, { seen: true }, { new: true });
      console.log('MESSAGE_SEEN -------------> ', message);
      if (message) {
        io.emit("MESSAGE_SEEN", { messageId, chatId: message.chatId, seen: true });
      }
    });

    socket.on("disconnect", async (e) => {
      await User.updateOne(
        { _id: user_id },
        { $set: {
           socket_id: socket.id,
          is_active: false, 
        } }
      );
      io.emit("USER_STATUS", { user_id, is_active: false });
    });
  });

  return io;
};

module.exports = websocket;
