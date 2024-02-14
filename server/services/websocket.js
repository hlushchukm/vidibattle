const socketio = require("socket.io");
const { createMessage } = require("../controllers/chat.controller");

const websocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  // Socket.IO
  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on("SEND_MESSAGE", async (message) => {
      const { chatId, sender, receiver, content } = message;

      if (!sender || !receiver || !content) {
        return;
      }

      const newMsg = await createMessage({ chatId, sender, receiver, content });

      io.emit("INCOMING_MESSAGE", {
        sender,
        receiver,
        message: newMsg.message,
        chat_id: newMsg.chat._id,
      });
    });

    socket.on("disconnect", (e) => {
      console.log(`Socket ${socket.id} disconnected`, e);
      io.emit("DISCONNECTED", e);
    });
  });

  return io;
};

module.exports = websocket;
