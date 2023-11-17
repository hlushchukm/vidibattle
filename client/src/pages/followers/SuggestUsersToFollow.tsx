import { useEffect, useState } from "react";
import { create, get } from "../../services/crud";
import { toast } from "react-toastify";
import PageLoading from "../../components/PageLoading";
import SuggestedUsersHeader from "./components/SuggestedUsersHeader";
import DisplayModeBtns from "../../components/DisplayModeBtns";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../services/asset-paths";
import { getName } from "../../services/utils";
import SearchBar from "../../components/SearchBar";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";

export default function SuggestUsersToFollow() {
  const [pageLoading, setPageLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [hideMoreBtn, setHideMoreBtn] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setPage(0);
      setSuggestedUsers([]);
      if (searchText.length === 0) {
        fetchSuggestedUsers(0);
      } else {
        searchUsers(0);
      }
    }, 500);

    return () => {
      clearTimeout(delayTimer);
    };
  }, [searchText]);

  const fetchSuggestedUsers = (pageCopy?: number) => {
    setIsSearch(false);
    setDataLoading(true);
    get("user/suggestion", {
      page: (pageCopy !== undefined ? pageCopy : page) + 1,
      limit,
    })
      .then((res) => {
        if (res.data.length < limit) {
          setHideMoreBtn(true);
        }
        setSuggestedUsers((s: any) => [...s, ...res.data]);
        setPage(parseInt(res.page) ?? page + 1);
        setLimit(res.limit);
        setPageLoading(false);
        setDataLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load suggested users"
        );
        setPageLoading(false);
        setDataLoading(false);
      });
  };

  const toggleFollow = (id: string, isFollow: boolean) => {
    changeFollowStatus(id, isFollow);
    create("user/" + (isFollow ? "follow" : "unfollow") + "/" + id, {}).catch(
      (e) => {
        console.log(e);
        toast.error("Error! action failed");
        changeFollowStatus(id, !isFollow);
      }
    );
  };

  const changeFollowStatus = (id: string, isFollow: boolean) => {
    const usersCopy = suggestedUsers.map((user: any) => {
      if (user._id === id) {
        user.followed = isFollow;
      }
      return user;
    });

    setSuggestedUsers(usersCopy);
  };

  const searchUsers = (page: number) => {
    if (searchText.trim().length > 0) {
      setIsSearch(true);
      setHideMoreBtn(false);
      setDataLoading(true);
      get("user/search", {
        name: searchText,
        page: page + 1,
        limit,
        excludeFollowing: true,
      })
        .then((res) => {
          if (res.data.length < limit) {
            setHideMoreBtn(true);
          }
          setSuggestedUsers((s: any) => [...s, ...res.data]);
          setPage(res.page);
          setDataLoading(false);
        })
        .catch((e) => {
          console.log(e);
          toast.error(
            e?.response?.data?.message ?? "Error while searching users"
          );
          setDataLoading(false);
        });
    } else {
      fetchSuggestedUsers(0);
    }
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (suggestedUsers.length === 0 && !dataLoading) {
    return (
      <>
        <SuggestedUsersHeader />
        <div className="bg-gradient-2">
          <div className="container profile-area pt-0 pb-0  vh-100">
            <div className="contant-section style-2 h-100">
              <div className="pt-3 px-4">
                <SearchBar
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search Users"
                />
              </div>
              <h3 className="text-muted py-5 text-center">
                No Users to Suggest
              </h3>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SuggestedUsersHeader />

      <div className="page-content bg-gradient-2 vh-100">
        <div className="container profile-area pt-0 pb-0 h-100">
          <div className="contant-section style-2 h-100">
            <div className="pt-3 px-4">
              <SearchBar
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search Users"
              />
            </div>
            <div className="title-bar m-0">
              <h6 className="mb-0"></h6>
              <div className="dz-tab style-2">
                <DisplayModeBtns listMode={true} />
              </div>
            </div>
            <div className="tab-content" id="myTab3Content">
              <div
                className="tab-pane fade"
                id="grid2"
                role="tabpanel"
                aria-labelledby="grid-tab"
              >
                <div className="dz-user-list row g-2">
                  {suggestedUsers.map((user: any) => (
                    <div key={user._id} className="col-6">
                      <div className="user-grid">
                        <a
                          style={{ cursor: "pointer" }}
                          className="media status media-60"
                        >
                          <img
                            src={formatResourceURL(user.profile_img)}
                            onError={handleProfileImageError}
                            alt="/"
                          />
                        </a>
                        <a href="user-profile.html" className="name">
                          {getName(user)}
                        </a>
                        <div className="small mb-3">
                          <span style={{ color: "#555" }}>
                            @{user.username}
                          </span>
                          <span className="text-black">{" | "}</span>
                          <span style={{ color: "#555" }}>
                            {user.followers_count} Followers
                          </span>
                        </div>
                        <a
                          onClick={() =>
                            toggleFollow(user._id, user.followed ? false : true)
                          }
                          style={{ cursor: "pointer" }}
                          className="follow-btn"
                        >
                          {user?.followed ? "UNFOLLOW" : "FOLLOW"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="tab-pane fade show active"
                id="list2"
                role="tabpanel"
                aria-labelledby="list-tab"
              >
                <div className="dz-user-list row g-3">
                  {suggestedUsers.map((user: any) => (
                    <div key={user._id} className="col-12">
                      <div className="user-grid style-2">
                        <a
                          style={{ cursor: "pointer" }}
                          className="d-flex align-items-center"
                        >
                          <div className="media status media-50">
                            <img
                              src={formatResourceURL(user.profile_img)}
                              onError={handleProfileImageError}
                              alt="/"
                            />
                          </div>
                          <div className="d-flex justify-content-start flex-column">
                            <span
                              className="name"
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                                textAlign: "left",
                              }}
                            >
                              {getName(user)}
                            </span>
                            <div
                              className="small"
                              style={{ textAlign: "left", marginLeft: "15px" }}
                            >
                              <span style={{ color: "#555" }}>
                                @{user.username}
                              </span>
                              <span className="text-black">{" | "}</span>
                              <span style={{ color: "#555" }}>
                                {user.followers_count} Followers
                              </span>
                            </div>
                          </div>
                        </a>
                        <a
                          onClick={() =>
                            toggleFollow(user._id, user.followed ? false : true)
                          }
                          style={{ cursor: "pointer" }}
                          className="follow-btn"
                        >
                          {user?.followed ? "UNFOLLOW" : "FOLLOW"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="tab-pane fade show active"
                id="list2"
                role="tabpanel"
                aria-labelledby="list-tab"
              >
                <div className="dz-user-list row g-3 py-3">
                  {!hideMoreBtn && suggestedUsers.length > 0 && (
                    <button
                      className={`btn light btn-primary ${
                        dataLoading && "disabled"
                      }`}
                      onClick={() => {
                        isSearch ? searchUsers(page) : fetchSuggestedUsers();
                      }}
                    >
                      {!dataLoading && <span>show more</span>}
                      {dataLoading && <i className="fa fa-spinner fa-spin"></i>}
                    </button>
                  )}
                  {suggestedUsers.length === 0 && dataLoading && (
                    <BlinkingLoadingCircles />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
