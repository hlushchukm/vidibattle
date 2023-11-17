import DisplayModeBtns from "../../../../components/DisplayModeBtns";
import { getName } from "../../../../services/utils";
import FollowUnfollowBtn from "./FollowUnfollowBtn";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../services/asset-paths";

export default function UsersList({
  listType,
  users,
  isLoggedIn,
  isOwnProfile,
  toggleFollow,
  followingHash,
  showMoreBtn,
  loading,
  showMoreClicked,
}: {
  listType: "followers" | "following";
  users: any[];
  isLoggedIn: boolean;
  isOwnProfile: boolean;
  toggleFollow: (id: string, action: "follow" | "unfollow", user?: any) => void;
  followingHash: { [key: string]: boolean };
  showMoreBtn: boolean;
  loading: boolean;
  showMoreClicked: () => void;
}) {
  if (users.length === 0) {
    return <h3 className="text-muted py-5 text-center">No Data</h3>;
  }

  return (
    <>
      <div className="swiper-slide">
        <div className="contant-section style-2 w-100">
          <div className="title-bar m-0">
            <h6 className="mb-0"></h6>
            <div className="dz-tab style-2">
              <DisplayModeBtns listMode={true} customId={listType} />
            </div>
          </div>
          <div className="tab-content" id="myTabContent4">
            <div
              className="tab-pane fade"
              id={"grid2" + listType}
              role="tabpanel"
              aria-labelledby="grid2-tab"
            >
              <div className="dz-user-list row g-2">
                {users.map((user: any, i: number) => (
                  <div key={i} className="col-6">
                    <div className="user-grid">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          window.location.replace("/profile/" + user.username)
                        }
                        className="media status media-60"
                      >
                        <img
                          src={formatResourceURL(user?.profile_img)}
                          onError={handleProfileImageError}
                          alt="/"
                        />
                      </a>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          window.location.replace("/profile/" + user.username)
                        }
                        className="name"
                      >
                        {getName(user)}
                      </a>
                      {isLoggedIn && isOwnProfile && (
                        <FollowUnfollowBtn
                          listType={listType}
                          toggleFollow={toggleFollow}
                          user={user}
                          followingHash={followingHash}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="tab-pane fade show active"
              id={"list2" + listType}
              role="tabpanel"
              aria-labelledby="list2-tab"
            >
              <div className="dz-user-list row g-3">
                {users.map((user: any, i: number) => (
                  <div key={i} className="col-12">
                    <div className="user-grid style-2">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          window.location.replace("/profile/" + user.username)
                        }
                        className="d-flex align-items-center"
                      >
                        <div className="media status media-50">
                          <img
                            src={formatResourceURL(user?.profile_img)}
                            onError={handleProfileImageError}
                            alt="/"
                          />
                        </div>
                        <span className="name">{getName(user)}</span>
                      </a>
                      {isLoggedIn && isOwnProfile && (
                        <FollowUnfollowBtn
                          listType={listType}
                          toggleFollow={toggleFollow}
                          user={user}
                          followingHash={followingHash}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showMoreBtn && !loading && (
              <div className="d-flex justify-content-center align-items-center">
                <button className="btn text-primary" onClick={showMoreClicked}>
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
          </div>
        </div>
      </div>
    </>
  );
}
