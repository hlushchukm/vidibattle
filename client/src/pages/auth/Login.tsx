import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
const env = import.meta.env;

export default function Login() {
  const navigate = useNavigate();
  const [forgotPassword, setForgotPassword] = useState(false);

  // TODO: handle forgotPassword

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    setForgotPassword(queryParameters.get("forgotPassword") === "true");
  }, []);

  const googleAuth = () => {
    window.open(`${env.VITE_API_URL}/api/auth/google`, "_self");
  };

  const facebookAuth = () => {
    window.open(`${env.VITE_API_URL}/api/auth/facebook`, "_self");
  };

  const instagramAuth = () => {
    window.open(`${env.VITE_API_URL}/api/auth/instagram`, "_self");
  };

  const gotoWhatsappLogin = () => {
    navigate("whatsapp");
  };

  return (
    <>
      <div className={styles["gradiant-bg"]}>
        <div className="page-wraper">
          {/* Preloader */}
          {/* <div id="preloader">
            <div className="spinner"></div>
          </div> */}
          {/* Preloader end */}

          {/* Welcome Start */}
          <div className="content-body">
            <div className="container vh-100">
              <div className="welcome-area">
                <div
                  className="bg-image bg-image-overlay"
                  style={{
                    backgroundImage: 'url("/assets/images/login/pic4.jpg")',
                  }}
                ></div>
                <div className="join-area">
                  <div className="started">
                    <h1 className="title">Sign in</h1>
                    {/* <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor
                    </p> */}
                  </div>
                  <div className="social-box">
                    {/* <span>Or sign in with</span> */}
                    <div className="d-flex justify-content-between">
                      <div
                        onClick={googleAuth}
                        className={styles["social-media-icons"]}
                      >
                        <img
                          src="/assets/images/icons/google.png"
                          alt="google"
                        />
                      </div>
                      <div
                        onClick={facebookAuth}
                        className={styles["social-media-icons"]}
                      >
                        <img
                          src="/assets/images/icons/facebook.png"
                          alt="facebook"
                        />
                      </div>
                      <div
                        onClick={instagramAuth}
                        className={styles["social-media-icons"]}
                      >
                        <img
                          src="/assets/images/icons/instagram.png"
                          alt="instagram"
                        />
                      </div>
                      {!forgotPassword && (
                        <div
                          onClick={gotoWhatsappLogin}
                          className={styles["social-media-icons"]}
                        >
                          <img
                            src="/assets/images/icons/whatsapp.png"
                            alt="whatsapp"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Welcome End */}
        </div>
      </div>
    </>
  );
}
