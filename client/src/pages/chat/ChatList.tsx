import ChatListHeader from "./components/ChatListHeader";
import SearchBar from "../../components/SearchBar";
import ContactsList from "./components/container/ContactsList";
import { useEffect, useRef, useState } from "react";
import { get } from "../../services/crud";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import { toast } from "react-toastify";

export default function ChatList() {
  const [loading, setLoading] = useState(true);
  const [chatsList, setChatsList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(15);
  const [searchText, setSearchText] = useState("");
  const [noMoreChats, setNoMoreChats] = useState(false);

  useEffect(() => {
    getChatsList();
  }, []);

  const delayTimer = useRef<any>();
  const searchInputChanged = (str: any) => {
    setSearchText(str);
    if (!loading) {
      clearTimeout(delayTimer.current);
      delayTimer.current = setTimeout(() => {
        setChatsList([]);
        setPage(0);
        setNoMoreChats(false);
        getChatsList(0, str);
      }, 500);
    }
  };

  const getChatsList = (pageNum?: number, searchTextCopy?: string) => {
    let queryParams: any = {
      page: pageNum ?? page + 1,
      limit,
    };

    if (searchTextCopy) {
      queryParams.searchString = searchTextCopy.trim();
    } else if (searchTextCopy === undefined && searchText.trim().length > 0) {
      queryParams.searchString = searchText.trim();
    }

    setLoading(true);

    get("chat/list/", queryParams)
      .then((res) => {
        if (res.data.length < limit) {
          setNoMoreChats(true);
        }
        if (queryParams.searchString) {
          setChatsList([...res.data]);
        } else {
          setChatsList((s: any) => [...s, ...res.data]);
        }
        setPage(res.page);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        toast.error(e?.response?.data?.message ?? "Error while fetching chats");
      });
  };

  return (
    <>
      <ChatListHeader />

      <div className="page-content vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <SearchBar
              value={searchText}
              onChange={(e) => searchInputChanged(e.target.value)}
            />

            {chatsList.length > 0 ? (
              <ContactsList list={chatsList} />
            ) : (
              <>
                {!loading && (
                  <div
                    className="d-flex justify-content-center align-items-center bg-light my-4 h1 text-primary rounded"
                    style={{ height: "250px", opacity: 0.7 }}
                  >
                    No Chats Found
                  </div>
                )}
              </>
            )}

            {loading && !noMoreChats && <BlinkingLoadingCircles />}
            {!noMoreChats && !loading && chatsList.length > 0 && (
              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="btn text-primary"
                  onClick={() => getChatsList()}
                >
                  <i className="fa fa-refresh me-2"></i>
                  <span>Show More</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
