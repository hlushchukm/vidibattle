import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { get } from "../../../../services/crud";
import { getUser, getUsername } from "../../../../services/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getName } from "../../../../services/utils";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../services/asset-paths";

export default function StoryBar() {
  const [users, setUsers] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [noMorePeople, setNoMorePeople] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFollowings();
  }, []);

  const fetchFollowings = () => {
    setLoading(true);
    get("user/following/" + getUsername(), { page: page + 1, limit })
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
        toast.error(
          e?.response?.data?.message ?? "Error while fetching following users"
        );
        setLoading(false);
      });
  };

  return (
    <>
      <div className="author-notification mb-4">
        <div className="swiper-btn-center-lr my-0">
          <div className="swiper-container categorie-swiper">
            <div className="">
              <Swiper spaceBetween={"0"} slidesPerView={"auto"}>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link
                      to={"/profile"}
                      className="categore-box style-1"
                      style={{ width: "68px" }}
                    >
                      <div className="story-bx">
                        <img
                          src={formatResourceURL(getUser().profile_img)}
                          onError={handleProfileImageError}
                          alt="/"
                          style={{ width: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <span className="detail">You</span>
                    </Link>
                  </div>
                </SwiperSlide>
                {users.map((user: any, i: number) => (
                  <SwiperSlide key={i}>
                    <div className="swiper-slide">
                      <Link
                        to={"/profile/" + user.username}
                        className="categore-box"
                        style={{ width: "68px" }}
                      >
                        <div className="story-bx">
                          <img
                            src={formatResourceURL(user.profile_img)}
                            onError={handleProfileImageError}
                            alt="/"
                            style={{ width: "100%" }}
                          />
                        </div>
                        <span className="detail">{getName(user)}</span>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
                {!noMorePeople && (
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="categore-box" style={{ width: "68px" }}>
                        <div className="story-bx">
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              boxSizing: "content-box",
                              borderRadius: "18px",
                              border: "5px solid #FEF3ED",
                              width: "54px",
                              height: "54px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!loading) fetchFollowings();
                            }}
                          >
                            {!loading ? (
                              <div
                                className="bg-secondary rounded-circle text-white d-flex justify-content-center align-items-center"
                                style={{ width: "20px", height: "20px" }}
                              >
                                <i
                                  className="fa fa-chevron-right"
                                  style={{ fontSize: "10px" }}
                                ></i>
                              </div>
                            ) : (
                              <div
                                className="bg-secondary rounded-circle text-white d-flex justify-content-center align-items-center"
                                style={{ width: "20px", height: "20px" }}
                              >
                                <i
                                  className="fa fa-spinner fa-spin"
                                  style={{ fontSize: "10px" }}
                                ></i>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="detail">More</span>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
