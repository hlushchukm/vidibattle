import { Swiper, SwiperSlide } from "swiper/react";

export default function StoryBar() {
  return (
    <>
      <div className="author-notification mb-4">
        <div className="swiper-btn-center-lr my-0">
          <div className="swiper-container categorie-swiper">
            <div className="">
              <Swiper spaceBetween={"0"} slidesPerView={"auto"}>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="story.html" className="categore-box style-1">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic8.jpg"
                          alt="/"
                        />
                        <div className="add-box">
                          <i className="fa-solid fa-plus"></i>
                        </div>
                      </div>
                      <span className="detail">Your Story</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <a href="live-story.html" className="categore-box">
                      <div className="story-bx">
                        <img
                          src="/assets/images/stories/small/pic1.jpg"
                          alt="/"
                        />
                        <div className="live-text">Live</div>
                      </div>
                      <span className="detail">Emilia</span>
                    </a>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
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
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
