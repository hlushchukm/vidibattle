import { useEffect, useState } from "react";
import BlockedHeader from "./components/BlockedHeader";
import { get } from "../../services/crud";
import PageLoading from "../../components/PageLoading";
import { getName } from "../../services/utils";
import { useNavigate } from "react-router-dom";
import DisplayModeBtns from "../../components/DisplayModeBtns";

export default function Blocked() {
  const [pageLoading, setPageLoading] = useState(true);
  const [apiData, setApiData] = useState<any>();
  const [blockedUsers, setBlockedUser] = useState<any>([]);
  const [pagination, setPagination] = useState<any>();
  const [requestingUser, setRequestingUser] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  useEffect(() => {
    if (apiData?.blocked_users) {
      setBlockedUser(apiData.blocked_users);
    }
    if (apiData?.pagination) {
      setPagination(apiData.pagination);
    }
    if (apiData?.requesting_user) {
      setRequestingUser(apiData.requesting_user);
    }
  }, [apiData]);

  const fetchBlockedUsers = () => {
    get("user/blocked")
      .then((res) => {
        setApiData(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <BlockedHeader name={getName(requestingUser)} />

      <div className="page-content">
        <div className="container profile-area pt-0">
          <div className="contant-section style-2">
            <div className="title-bar m-0">
              <h6 className="mb-0"></h6>
              <div className="dz-tab style-2">
                <DisplayModeBtns />
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
                          onClick={() => navigate("/profile/" + user._id)}
                          className="media status media-60"
                        >
                          <img src={user.profile_img} alt="/" />
                          <div className="active-point"></div>
                        </a>
                        <a href="user-profile.html" className="name">
                          {getName(user)}
                        </a>
                        <a href="javascript:void(0);" className="follow-btn">
                          UNBLOCK
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
                          onClick={() => navigate("/profile/" + user._id)}
                          className="d-flex align-items-center"
                        >
                          <div className="media status media-50">
                            <img src={user.profile_img} alt="/" />
                            <div className="active-point"></div>
                          </div>
                          <span className="name">{getName(user)}</span>
                        </a>
                        <a href="javascript:void(0);" className="follow-btn">
                          UNBLOCK
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
