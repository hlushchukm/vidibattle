import ChatHeader from "./components/ChatHeader";
import SearchBar from "../../components/SearchBar";
import ContactsList from "./components/container/ContactsList";

export default function ChatList() {
  return (
    <>
      <ChatHeader />

      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <SearchBar />

            <ContactsList />
          </div>
        </div>
      </div>
    </>
  );
}
