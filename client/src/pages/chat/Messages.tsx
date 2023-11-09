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
  const [chatNotFound, setChatNotFound] = useState(false);
  const params = useParams();

  const [receiver, setReceiver] = useState<any>(null);
  const [userId, setUserId] = useState<String | null>(null);
  const chatIdRef = useRef();

  const currentUserId = useCurrentUserStore((state: any) => state.id);
  const currentChat = useCurrentChatStore((state: any) => state.currentChat);

  const [pageSize, setPageSize] = useState(25);
  const [lastDate, setLastDate] = useState();
  const [lastMessageId, setLastMessageId] = useState();
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // TODO: sending indicator

  useEffect(() => {
    // start with the page scrolled to the bottom
    // TODO: scroll not working on coming from share page, and it should scroll after fetching the data
    window.scrollTo(0, document.body.scrollHeight);

    // TODO: check if we have socket connection
    if (params.id) {
      setUserId(params.id);
      getMessages(params.id);
    }

    // check if we already have a listener, if so skip
    if (socket.listeners("INCOMING_MESSAGE").length === 0) {
      // Listen for incoming messages from the server
      socket.on("INCOMING_MESSAGE", function (res) {
        if (res.chat_id === chatIdRef.current) {
          console.log("incoming message ", res.message);
          const oldMessages = [...messagesRef.current];
          oldMessages.push(res.message);
          setMessages([...oldMessages]);
        }
      });
    }

    // check if it came from a share screen, and set the input element with the text
    if (
      queryParams.get("share") === "true" &&
      queryParams.get("url") !== undefined
    ) {
      let text = "";

      if (queryParams.get("url")) {
        text = queryParams.get("url") ?? " ";
      }

      if (queryParams.get("title")) {
        text += " " + queryParams.get("title");
      }

      setNewMessage(text.trim());
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
    let query: any = { pageSize };
    if (lastDate) {
      query.lastDate = lastDate;
    }
    if (lastMessageId) {
      query.lastMessageId = lastMessageId;
    }

    setMessagesLoading(true);
    get("chat/messages/" + cid, query)
      .then((res) => {
        if (
          res.data?.chat?.participants &&
          res.data?.chat?.participants.length > 0
        ) {
          getSecondUser(res.data.chat.participants);
        }

        if (res.data.messages.length < pageSize) {
          setNoMoreMessages(true);
        }

        setMessages((s: any) => [...res.data?.messages, ...s]);
        setLastDate(res.data.lastDate);
        setLastMessageId(res.data.lastMessageId);
        setChatNotFound(false);
        chatIdRef.current = res.data?.chat?._id;
        setMessagesLoading(false);
      })
      .catch((e) => {
        setChatNotFound(true);
        setMessagesLoading(false);
        console.log(e);
      });
  };

  const handleSendMessage = () => {
    if (newMessage.length === 0) return;
    console.log("Here", newMessage, receiver);
    // TODO: how to handle message send fails

    let payload: any = {
      sender: currentUserId,
      receiver: receiver._id,
      content: newMessage,
    };

    if (chatIdRef.current) {
      payload.chatId = chatIdRef.current;
    }

    socket.emit("SEND_MESSAGE", payload);
    setNewMessage("");
  };

  const handleMessageChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      <MessageHeader user={receiver} />

      {chatNotFound && (!messages || messages.length < 1) && <ChatNotFound />}
      {!chatNotFound && (
        <>
          <MessagesContainer
            messages={messages}
            loading={messagesLoading}
            showMoreBtn={!noMoreMessages}
            loadMore={() => getMessages(params.id ?? "")}
          />
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
