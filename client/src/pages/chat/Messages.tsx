import MessageHeader from "./components/MessageHeader";
import MessageInput from "./components/container/MessageInput";
import MessagesContainer from "./components/container/MessagesContainer";

export default function Messages() {
  return (
    <>
      <MessageHeader />

      <MessagesContainer />

      <MessageInput />
    </>
  );
}
