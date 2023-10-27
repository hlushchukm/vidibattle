import { io } from "socket.io-client";
import { env } from "../env";

const socket = io(env.VITE_WEB_SOCKET_URL, { withCredentials: true }); // Connect to the server's WebSocket endpoint

export function initializeSocket() {
  // establish connection
  socket.connect();

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
}

export default socket;
