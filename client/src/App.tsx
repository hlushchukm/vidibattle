import { useEffect } from "react";
import "./App.css";
import Router from "./Routes";
import socket, { initializeSocket } from "./services/socket";

function App() {
  useEffect(() => {
    // TODO: create socket for authenticated user
    // create socket connection
    initializeSocket();

    return () => {
      // Clean up the socket connection if necessary
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
