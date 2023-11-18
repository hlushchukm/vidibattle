import { useEffect, useState } from "react";
import SocialMediaShareBtns from "./SocialMediaShareBtns";
import { get } from "../services/crud";
import { getUsername, isLoggedIn } from "../services/auth";
import { toast } from "react-toastify";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getName } from "../services/utils";
import { useShareStore } from "../store";
import { env } from "../env";
import BlinkingLoadingCircles from "./BlinkingLoadingCircles";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../services/asset-paths";

export default function ShareModal() {
  const [shareMessage, setShareMessage] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [noMorePeople, setNoMorePeople] = useState(false);
  const [loading, setLoading] = useState(false);
  const post = useShareStore((state) => state.post);
  const [title, setTitle] = useState(shareMessage);
  const [url, setUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showingSearchResults, setShowingSearchResults] = useState(false);
  const [searchResultCount, setSearchResultCount] = useState();

  useEffect(() => {
    if (isLoggedIn()) fetchFollowings();
  }, []);

  useEffect(() => {
    if (post) {
      setUrl(env.VITE_CLIENT_URL + "/post/" + post._id);
      if (shareMessage.length <= 0) {
        setTitle(post.caption);
      }
    }
  }, [post]);

  useEffect(() => {
    if (shareMessage.length > 0) {
      setTitle(shareMessage);
    } else {
      setTitle(post?.caption ?? "");
    }
  }, [shareMessage]);

  const fetchFollowings = (pageNum?: number) => {
    setShowingSearchResults(false);
    setLoading(true);
    get("user/following/" + getUsername(), { page: pageNum ?? page + 1, limit })
      .then((res) => {
        if (res.data.length < limit) {
          setNoMorePeople(true);
        }
        setUsers((s: any) => [...s, ...res.data]);
        setPage(parseInt(res.page));
        setLimit(parseInt(res.limit));
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e?.response?.data?.message ?? "Error while fetching users");
        setLoading(false);
      });
  };

  const searchUsers = (continued = false) => {
    if (searchText.trim().length > 0) {
      let pageCopy = page;
      if (!showingSearchResults || !continued) {
        setUsers([]);
        setPage(0);
        pageCopy = 0;
      }
      setNoMorePeople(false);
      setLoading(true);
      get("user/search", { name: searchText, page: pageCopy + 1, limit })
        .then((res) => {
          if (res.data.length < limit) {
            setNoMorePeople(true);
          }

          setUsers((s: any) => [...s, ...res.data]);

          setPage(res.page);
          setSearchResultCount(res.totalCount);
          setShowingSearchResults(true);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          toast.error(
            e?.response?.data?.message ?? "Error while searching users"
          );
          setLoading(false);
        });
    } else if (showingSearchResults) {
      setPage(0);
      setUsers([]);
      setNoMorePeople(false);
      setShowingSearchResults(false);
      fetchFollowings(1);
    }
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      searchUsers(false);
    }, 500);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [searchText]);

  const navigate = useNavigate();

  return (
    <>
      <div
        className="offcanvas offcanvas-bottom"
        tabIndex={-1}
        id="offcanvasBottom1"
      >
        <button
          type="button"
          className="btn-close drage-close btn-primary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          title="Close"
        ></button>
        <div className="offcanvas-header share-style m-0 pb-0">
          <form className="w-100">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Write a message ..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
            />
          </form>
        </div>
        <div className="offcanvas-body container pb-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchUsers(false);
            }}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search.."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span
                onClick={() => searchUsers(false)}
                className="input-group-text"
                style={{ cursor: "pointer" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                    fill="#FE9063"
                  ></path>
                </svg>
              </span>
            </div>
          </form>
          <div>
            <SocialMediaShareBtns shareMessage={shareMessage} />
          </div>
          <div className="canvas-height mt-4 dz-scroll">
            <ul className="share-list">
              {showingSearchResults && !loading && (
                <div className="py-2">{searchResultCount} total results</div>
              )}
              {users.map((user: any, i: number) => (
                <li key={i}>
                  <div className="left-content">
                    <a
                      onClick={() =>
                        navigate({
                          pathname: "/chat/" + user.username,
                          search: createSearchParams({
                            share: "true",
                            url,
                            title,
                          }).toString(),
                        })
                      }
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="offcanvas"
                    >
                      <img
                        src={formatResourceURL(user.profile_img)}
                        onError={handleProfileImageError}
                        alt="/"
                      />
                    </a>
                    <a
                      onClick={() =>
                        navigate({
                          pathname: "/chat/" + user.username,
                          search: createSearchParams({
                            share: "true",
                            url,
                            title,
                          }).toString(),
                        })
                      }
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="offcanvas"
                    >
                      <h6 className="name">{getName(user)}</h6>
                      <span className="username">@{user.username}</span>
                    </a>
                  </div>
                  <button
                    onClick={() =>
                      navigate({
                        pathname: "/chat/" + user.username,
                        search: createSearchParams({
                          share: "true",
                          url,
                          title,
                        }).toString(),
                      })
                    }
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="offcanvas"
                  >
                    Send
                  </button>
                </li>
              ))}

              {!noMorePeople && !loading && (
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    className="btn text-primary"
                    onClick={() =>
                      showingSearchResults
                        ? searchUsers(true)
                        : fetchFollowings()
                    }
                  >
                    <i className="fa fa-refresh me-2"></i>
                    <span>Show More</span>
                  </button>
                </div>
              )}
              {loading && (
                <div className="py-2">
                  <BlinkingLoadingCircles />
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
