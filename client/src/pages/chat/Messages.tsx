import { useState, useEffect, useRef } from "react";
import MessageHeader from "./components/MessageHeader";
import MessageInput from "./components/container/MessageInput";
import MessagesContainer from "./components/container/MessagesContainer";
import socket from "../../services/socket";
import { useLocation, useParams } from "react-router-dom";
import { create, get } from "../../services/crud";
import { useChatReceiverStore, useCurrentUserStore } from "../../store";
import ChatNotFound from "../../components/ChatNotFound";
import { toast } from "react-toastify";

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [tempMessages, setTempMessages] = useState<any>([]);
  const messagesRef = useRef<any>(); // to access messages within socket event listener. States are not accessible
  const [chatNotFound, setChatNotFound] = useState(false);
  const params = useParams();

  const [receiver, setReceiver] = useState<any>(null);
  const receiverRef = useRef<any>(null);
  const chatIdRef = useRef();

  const currentUserId = useCurrentUserStore((state: any) => state.id);
  const receiverFromStore = useChatReceiverStore(
    (state: any) => state.receiver
  );

  const [pageSize] = useState(25);
  const [lastDate, setLastDate] = useState();
  const [lastMessageId, setLastMessageId] = useState();
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);

  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [lastMessageToScrollTo, setLastMessageToScrollTo] = useState("");
  const messagesComponentRef = useRef<{ [key: string]: HTMLElement }>({});

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);

    if (params.username) {
      getMessages(params.username);
    }

    // Listen for incoming messages from the server
    socket.on("INCOMING_MESSAGE", function (res) {
      if (
        res.chat_id === chatIdRef.current ||
        (res.sender === currentUserId &&
          res.receiver === receiverRef.current?._id) ||
        (res.sender === receiverRef.current?._id &&
          res.receiver === currentUserId)
      ) {
        console.log("incoming message ", res.message);
        const oldMessages = [...messagesRef.current];
        oldMessages.push(res.message);
        setMessages([...oldMessages]);
        setTempMessages((s: any[]) => s.splice(1));
        chatIdRef.current = res.chat_id;
      }
    });

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

    // scroll to bottom after loading the messages for the first time
    if (firstTimeLoad && messages.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
      setFirstTimeLoad(false);
    } else {
      // scroll to last message before loading when loading more messages
      messagesComponentRef.current[lastMessageToScrollTo]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [messages]);

  useEffect(() => {
    setReceiver(receiverFromStore);
  }, [receiverFromStore]);

  useEffect(() => {
    receiverRef.current = receiver;
  }, [receiver]);

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
        if (res.data.messages.length < pageSize) {
          setNoMoreMessages(true);
        }

        setMessages((s: any) => [...res.data?.messages, ...s]);
        setReceiver(res.data.receiver);
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

    let payload: any = {
      sender: currentUserId,
      receiver: receiver._id,
      content: newMessage,
    };

    if (chatIdRef.current) {
      payload.chatId = chatIdRef.current;
    }

    if (socket.connected) {
      socket.emit("SEND_MESSAGE", payload);
    } else {
      sendMessageWithAPI(payload);
    }

    addTempMessage(payload);
    setNewMessage("");
  };

  const sendMessageWithAPI = (payload: any) => {
    create("chat/send", payload)
      .then((res) => {
        setTempMessages((s: any[]) => s.splice(1));
        setMessages((s: any) => [...s, res.data]);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't send message"
        );
      });
  };

  const addTempMessage = (payload: any) => {
    payload.createdAt = new Date();
    setTempMessages((s: any) => [...s, payload]);
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
          <MessagesContainer
            messages={messages}
            tempMessages={tempMessages}
            loading={messagesLoading}
            showMoreBtn={!noMoreMessages}
            loadMore={() => {
              setLastMessageToScrollTo(lastMessageId ?? "");
              getMessages(params.username ?? "");
            }}
            messageComponentsRef={messagesComponentRef}
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
