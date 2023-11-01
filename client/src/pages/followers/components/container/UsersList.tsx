import { useEffect, useState } from "react";
import DisplayModeBtns from "../ui/DisplayModeBtns";
import { getUserId } from "../../../../services/auth";
import { useParams } from "react-router-dom";

export default function UsersList({
  listType,
  users,
}: {
  listType: "followers" | "following";
  users: any[];
}) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userId, setUserId] = useState("");
  const params = useParams();

  useEffect(() => {
    setLoggedIn(getUserId() !== null && getUserId() !== null);

    if (params.id && params.id !== getUserId()) {
      setIsOwnProfile(false);
      setUserId(params.id);
    } else {
      setIsOwnProfile(true);
      setUserId(getUserId() ?? "");
    }
  }, []);

  return (
    <>
      <div className="swiper-slide">
        <div className="contant-section style-2 w-100">
          <div className="title-bar m-0">
            <h6 className="mb-0"></h6>
            <div className="dz-tab style-2">
              <DisplayModeBtns />
            </div>
          </div>
          <div className="tab-content" id="myTabContent4">
            <div
              className="tab-pane fade"
              id="grid2"
              role="tabpanel"
              aria-labelledby="grid2-tab"
            >
              <div className="dz-user-list row g-2">
                {users.map((user: any, i: number) => (
                  <div key={i} className="col-6">
                    <div className="user-grid">
                      <a
                        href="user-profile.html"
                        className="media status media-60"
                      >
                        <img
                          src="/assets/images/stories/small/pic1.jpg"
                          alt="/"
                        />
                        <div className="active-point"></div>
                      </a>
                      <a href="user-profile.html" className="name">
                        Andy Lee
                      </a>
                      {listType === "following" &&
                        isLoggedIn &&
                        isOwnProfile && (
                          <a href="javascript:void(0);" className="follow-btn">
                            UNFOLLOW
                          </a>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="tab-pane fade show active"
              id="list2"
              role="tabpanel"
              aria-labelledby="list2-tab"
            >
              <div className="dz-user-list row g-3">
                {users.map((user: any, i: number) => (
                  <div key={i} className="col-12">
                    <div className="user-grid style-2">
                      <a
                        href="user-profile.html"
                        className="d-flex align-items-center"
                      >
                        <div className="media status media-50">
                          <img
                            src="/assets/images/stories/small/pic6.jpg"
                            alt="/"
                          />
                          <div className="active-point"></div>
                        </div>
                        <span className="name">Andy Lee</span>
                      </a>
                      {listType === "following" &&
                        isLoggedIn &&
                        isOwnProfile && (
                          <a href="javascript:void(0);" className="follow-btn">
                            UNFOLLOW
                          </a>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
