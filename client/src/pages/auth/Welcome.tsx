import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 600);
  }, []);

  return (
    <>
      {/* splash */}
      {pageLoading && (
        <div className="loader-screen" id="">
          <div className="main-screen">
            <div className="circle-2"></div>
            <div className="circle-3"></div>
            <div className="circle-4"></div>
            <div className="circle-5"></div>
            <div className="circle-6"></div>
            <div className="brand-logo">
              <div className="logo">
                <img
                  src="/assets/images/vector.svg"
                  alt="spoon-1"
                  className="wow bounceInDown"
                />
              </div>
              <div id="loading-area" className="loading-page-4">
                <div className="loading-inner">
                  <div className="load-text">
                    <span data-text="S" className="text-load">
                      S
                    </span>
                    <span data-text="O" className="text-load">
                      O
                    </span>
                    <span data-text="Z" className="text-load">
                      Z
                    </span>
                    <span data-text="I" className="text-load">
                      I
                    </span>
                    <span data-text="E" className="text-load">
                      E
                    </span>
                    <span data-text="T" className="text-load">
                      T
                    </span>
                    <span data-text="Y" className="text-load">
                      Y
                    </span>
                    <span data-text="." className="text-load text-primary">
                      .
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* splash */}

      {/* Welcome Start  */}
      <div className="content-body">
        <div className="container vh-100">
          <div className="welcome-area">
            <div
              className="bg-image bg-image-overlay"
              style={{ backgroundImage: "url(/assets/images/login/pic1.jpg)" }}
            ></div>
            <div className="join-area">
              <div className="mb-3">
                <div className="swiper-container get-started">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <div className="started">
                        <h1 className="title">
                          Hello, And Welcome to Soziety.
                        </h1>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor
                        </p>
                      </div>
                    </div>
                    <div className="swiper-slide">
                      <div className="started">
                        <h1>People's First Prefrence Is Soziety</h1>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor
                        </p>
                      </div>
                    </div>
                    <div className="swiper-slide">
                      <div className="started">
                        <h1>Expand Your Network With Soziety</h1>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-btn">
                  <div className="swiper-pagination style-1 flex-1"></div>
                </div>
              </div>
              <Link
                to="login?create=true"
                className="btn btn-primary btn-block mb-3"
              >
                CREATE ACCOUNT
              </Link>
              <Link to="login" className="btn btn-light btn-block mb-3">
                SIGN IN
              </Link>
              {/* <a
                href="forgot-password.html"
                className="text-light text-center d-block"
              >
                Forgot your account?
              </a> */}
            </div>
          </div>
        </div>
      </div>
      {/* Welcome End */}
    </>
  );
}
