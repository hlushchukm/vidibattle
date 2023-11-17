import { useEffect, useState } from "react";
import BlockedHeader from "./components/BlockedHeader";
import { create, get } from "../../services/crud";
import PageLoading from "../../components/PageLoading";
import { getName } from "../../services/utils";
import { useNavigate } from "react-router-dom";
import DisplayModeBtns from "../../components/DisplayModeBtns";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../services/asset-paths";
import { toast } from "react-toastify";

export default function Blocked() {
  const [pageLoading, setPageLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<any>([]);
  const [pagination, setPagination] = useState<any>({
    page: 0,
    limit: 10,
  });
  const [hideMoreBtn, setHideMoreBtn] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = () => {
    setDataLoading(true);
    get("user/blocked", { page: pagination.page + 1, limit: pagination.limit })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pagination.limit) {
          setHideMoreBtn(true);
        }
        setBlockedUsers((s: any) => [...s, ...res.data]);
        setPagination(res.pagination);
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

  const toggleBlock = (id: string, is_unblock: boolean) => {
    const originalCopy = JSON.stringify(blockedUsers);
    const blockedListCopy = blockedUsers.map((user: any) => {
      if (user._id === id) {
        user.unblocked = is_unblock;
      }
      return user;
    });

    setBlockedUsers(blockedListCopy);

    create("user/" + (is_unblock ? "unblock/" : "block/") + id, {}).catch(
      (e) => {
        console.log(e);
        setBlockedUsers(JSON.parse(originalCopy));
      }
    );
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (blockedUsers.length === 0) {
    return (
      <>
        <BlockedHeader />
        <h3 className="text-muted py-5 text-center">No Blocked Users</h3>;
      </>
    );
  }

  return (
    <>
      <BlockedHeader />

      <div className="page-content">
        <div className="container profile-area pt-0">
          <div className="contant-section style-2">
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
                  {blockedUsers.map((user: any) => (
                    <div key={user._id} className="col-6">
                      <div className="user-grid">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/profile/" + user.username)}
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
                        <a
                          onClick={() =>
                            toggleBlock(user._id, user.unblocked ? false : true)
                          }
                          style={{ cursor: "pointer" }}
                          className="follow-btn"
                        >
                          {user?.unblocked ? "BLOCK" : "UNBLOCK"}
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
                  {blockedUsers.map((user: any) => (
                    <div key={user._id} className="col-12">
                      <div className="user-grid style-2">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/profile/" + user.username)}
                          className="d-flex align-items-center"
                        >
                          <div className="media status media-50">
                            <img
                              src={formatResourceURL(user.profile_img)}
                              onError={handleProfileImageError}
                              alt="/"
                            />
                          </div>
                          <span className="name">{getName(user)}</span>
                        </a>
                        <a
                          onClick={() =>
                            toggleBlock(user._id, user.unblocked ? false : true)
                          }
                          style={{ cursor: "pointer" }}
                          className="follow-btn"
                        >
                          {user?.unblocked ? "BLOCK" : "UNBLOCK"}
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
                  {!hideMoreBtn && (
                    <button
                      className={`btn light btn-primary ${
                        dataLoading && "disabled"
                      }`}
                      onClick={fetchBlockedUsers}
                    >
                      {!dataLoading && <span>show more</span>}
                      {dataLoading && <i className="fa fa-spinner fa-spin"></i>}
                    </button>
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
