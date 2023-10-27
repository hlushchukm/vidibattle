import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SplashScreen from "../../components/SplashScreen";
import styles from "./styles.module.css";

export default function Welcome() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setPageLoading(false), 600);

    // remove a css class from the parent element that causes style problem
    const parentElement = document.getElementById("root") as HTMLElement;
    parentElement.classList.remove("header-fixed");
  }, []);

  if (pageLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      {/* Welcome Start  */}
      <div className={styles["gradiant-bg"]}>
        <div className="page-wraper"></div>
        <div className="content-body">
          <div className="container vh-100">
            <div className="welcome-area">
              <div
                className="bg-image bg-image-overlay"
                style={{
                  backgroundImage: "url(/assets/images/login/pic1.jpg)",
                }}
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
      </div>
      {/* Welcome End */}
    </>
  );
}
