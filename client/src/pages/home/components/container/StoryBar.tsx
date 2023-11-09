import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { get } from "../../../../services/crud";
import { getUserId } from "../../../../services/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getName } from "../../../../services/utils";

export default function StoryBar() {
  const [users, setUsers] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [noMorePeople, setNoMorePeople] = useState(false);
  const [loading, setLoading] = useState(false);
  // TODO: add pagination

  useEffect(() => {
    fetchFollowings();
  }, []);

  const fetchFollowings = () => {
    setLoading(true);
    get("user/following/" + getUserId(), { page: page + 1, limit })
      .then((res) => {
        if (res.data.length < limit) {
          setNoMorePeople(true);
        }
        setUsers(res.data);
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
                    <Link to={"/profile"} className="categore-box style-1">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic8.jpg"
                          alt="/"
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
                        to={"/profile/" + users._id}
                        className="categore-box"
                        style={{width: "68px"}}
                      >
                        <div className="story-bx">
                          <img src={user.profile_img} alt="/" />
                        </div>
                        <span className="detail">{getName(user)}</span>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
                {/* <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic2.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Richard</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic3.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Jasmine</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic4.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Lucas</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic5.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Hendri</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic6.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Carla</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="live-story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic7.jpg"
                          alt="/"
                        />
                        <div className="live-text">Live</div>
                      </div>
                      <span className="detail">Jermy</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic5.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Kerry</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic6.jpg"
                          alt="/"
                        />
                      </div>
                      <span className="detail">Perry</span>
                    </a>
                  </div>
                </SwiperSlide> */}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
