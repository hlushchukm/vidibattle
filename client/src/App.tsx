import { useEffect } from "react";
import "./App.css";
import Router from "./Routes";
import socket, { initializeSocket } from "./services/socket";
import { getUser, getUserId } from "./services/auth";

function App() {
  useEffect(() => {
    if (getUser() !== null && getUserId() !== null && !socket.connected) {
      // create socket connection for logged in users
      initializeSocket();

      return () => {
        // Clean up the socket connection if necessary
        socket.disconnect();
      };
    }
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
