import { useState, useEffect, useRef } from "react";
import MessageHeader from "./components/MessageHeader";
import MessageInput from "./components/container/MessageInput";
import MessagesContainer from "./components/container/MessagesContainer";
import socket from "../../services/socket";
import { useLocation, useParams } from "react-router-dom";
import { get } from "../../services/crud";
import { useCurrentChatStore, useCurrentUserStore } from "../../store";
import ChatNotFound from "../../components/ChatNotFound";

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const messagesRef = useRef<any>(); // to access messages within socket event listener. States are not accessible
  const [isNewChat, setNewChat] = useState(false);
  const [chatNotFound, setChatNotFound] = useState(false);
  const location = useLocation();
  const params = useParams();

  const [receiver, setReceiver] = useState<any>(null);
  const [chatId, setChatId] = useState<String | null>(null);

  const currentUser = useCurrentUserStore((state: any) => state.currentUser);
  const currentUserId = useCurrentUserStore((state: any) => state.id);
  const currentChat = useCurrentChatStore((state: any) => state.currentChat);
  const setCurrentChat = useCurrentChatStore(
    (state: any) => state.setCurrentChat
  );

  useEffect(() => {
    // TODO: check if we have socket connection
    if (location.pathname.includes("new") && params.userId) {
      setNewChat(true);
      setChatId(null);
      getReceiverInfo(params.userId);
    } else if (params.id) {
      setNewChat(false);
      setChatId(params.id);
      getMessages(params.id);
    }

    // check if we already have a listener, if so skip
    if (socket.listeners("INCOMING_MESSAGE").length === 0) {
      // Listen for incoming messages from the server
      socket.on("INCOMING_MESSAGE", function (res) {
        if (res.chat_id === params.id) {
          console.log("incoming message ", res.message);
          const oldMessages = [...messagesRef.current];
          oldMessages.push(res.message);
          setMessages([...oldMessages]);
          // TODO: if we are on a new message page and the first text has been sent, go to the new chat page
        }
      });
    }
  }, []);

  useEffect(() => {
    // update messages ref whenever messages change
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (currentChat?.participants && currentChat?.participants?.length > 0) {
      getSecondUser(currentChat.participants);
    }
  }, [currentChat]);

  const getSecondUser = (participants: any[]) => {
    for (let i = 0; participants.length; i++) {
      if (participants[i]._id !== currentUserId) {
        setReceiver(participants[i]);
        return;
      }
    }
  };

  const getMessages = (cid: string) => {
    get("chat/messages/" + cid)
      .then((res) => {
        if (
          res.data?.chat?.participants &&
          res.data?.chat?.participants.length > 0
        ) {
          getSecondUser(res.data.chat.participants);
        }
        setMessages(res.data?.messages ?? []);
        console.log(res);
        setChatNotFound(false);
      })
      .catch((e) => {
        setChatNotFound(true);
        console.log(e);
      });
  };

  const getReceiverInfo = (userId: string) => {
    get("user/basicInfo/" + userId)
      .then((res) => {
        setReceiver(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSendMessage = () => {
    if (newMessage.length === 0) return;
    console.log("Here", newMessage, receiver);

    socket.emit("SEND_MESSAGE", {
      sender: currentUserId,
      receiver: receiver._id,
      content: newMessage,
      chatId: chatId,
    });
    setNewMessage("");
  };

  const handleMessageChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      <MessageHeader user={receiver} />

      {chatNotFound && <ChatNotFound />}
      {!chatNotFound && (
        <>
          <MessagesContainer messages={messages} />
          <MessageInput
            text={newMessage}
            setText={handleMessageChange}
            sendMessage={handleSendMessage}
          />
        </>
      )}
    </>
  );
}
