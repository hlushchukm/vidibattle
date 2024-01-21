import { Link } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import HeaderLogo from "../../../components/HeaderLogo";

export default function HomeHeader({ installPWA }: { installPWA: any }) {
  const handleInstallClick = () => {
    if (installPWA) {
      installPWA.prompt();
    }
  };

  return (
    <>
      {/* Header */}

      <TopNavBarWrapper>
        <div className="left-content">
          <HeaderLogo />
          <h4 className="title mb-0">Home</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content d-flex align-items-center">
          <Link
            to="/competition"
            title="competitions"
            style={{ cursor: "pointer" }}
            className="bell-icon menu-toggler me-2"
          >
            <i className="fa fa-trophy text-primary"></i>
          </Link>
          {installPWA && (
            <a
              onClick={handleInstallClick}
              title="install app"
              style={{ cursor: "pointer" }}
              className="bell-icon menu-toggler me-2"
            >
              <i className="fa fa-download text-primary"></i>
            </a>
          )}
          {/* <a href="reels" className="bell-icon me-2">
            <svg
              id="Layer_3"
              height="24"
              viewBox="0 0 22 22"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 3"
            >
              <g>
                <path d="m-.0132 8v9a5.0018 5.0018 0 0 0 5 5h12a5.0018 5.0018 0 0 0 5-5v-9zm14.49 6.87-6 3.38a.9472.9472 0 0 1 -.49.13 1.0145 1.0145 0 0 1 -1-1v-6.76a1.0039 1.0039 0 0 1 1.49-.87l6 3.38a.9971.9971 0 0 1 0 1.74z" />
                <path d="m6.0968 6h-6.11v-1a4.9909 4.9909 0 0 1 2.27-4.19l1.19 1.62z" />
                <path d="m15.1068 6h-6.52l-2.96-4-1.44-1.93a4.2509 4.2509 0 0 1 .8-.07h5.72l1.46 2z" />
                <path d="m21.9868 5v1h-4.4l-2.95-4-1.47-2h3.82a5.0018 5.0018 0 0 1 5 5z" />
              </g>
            </svg>
          </a>
          <a href="notification" className="bell-icon me-2">
            <svg
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99863 5.94146C8.25877 4.69837 9.96789 4 11.75 4C13.5321 4 15.2412 4.69837 16.5014 5.94146C17.7615 7.18456 18.4694 8.87057 18.4694 10.6286C18.4694 13.6602 19.1264 15.5253 19.7182 16.5956C20.0157 17.1336 20.3031 17.4826 20.498 17.6854C20.5957 17.7872 20.6709 17.853 20.7136 17.8881C20.7334 17.9044 20.7462 17.9141 20.751 17.9176C21.1638 18.1996 21.3462 18.7128 21.2002 19.1883C21.0523 19.6703 20.6019 20 20.0914 20H3.40862C2.89809 20 2.44774 19.6703 2.2998 19.1883C2.15385 18.7128 2.33617 18.1996 2.74898 17.9176C2.75364 17.9144 2.75833 17.9113 2.76305 17.9082L2.7604 17.9099L2.7558 17.913L2.74949 17.9173C2.74783 17.9185 2.74697 17.9191 2.74688 17.9192C2.74681 17.9192 2.7472 17.9189 2.74803 17.9183C2.7483 17.9181 2.74862 17.9179 2.74898 17.9176C2.75375 17.9141 2.76657 17.9044 2.78642 17.8881C2.82906 17.853 2.90431 17.7872 3.00203 17.6854C3.19687 17.4826 3.48428 17.1336 3.78178 16.5956C4.37359 15.5253 5.03055 13.6602 5.03055 10.6286C5.03055 8.87056 5.73849 7.18456 6.99863 5.94146ZM2.76305 17.9082C2.76307 17.9082 2.76308 17.9081 2.7631 17.9081L2.76306 17.9082L2.76305 17.9082ZM17.6975 17.7143C17.693 17.7063 17.6886 17.6982 17.6841 17.6901C16.8857 16.2461 16.1524 13.997 16.1524 10.6286C16.1524 9.47677 15.6886 8.37215 14.863 7.55771C14.0374 6.74326 12.9176 6.28571 11.75 6.28571C10.5824 6.28571 9.46264 6.74326 8.63703 7.55771C7.81143 8.37215 7.3476 9.47677 7.3476 10.6286C7.3476 13.997 6.61433 16.2461 5.81591 17.6901C5.81144 17.6982 5.80697 17.7063 5.8025 17.7143H17.6975ZM2.7645 17.9072C2.7645 17.9072 2.7645 17.9072 2.76449 17.9072L2.76425 17.9074C2.76434 17.9073 2.76442 17.9073 2.7645 17.9072Z"
                fill="#FE9063"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.87713 21.1933C9.47825 20.797 10.2482 21.0296 10.5969 21.7127C10.6633 21.8427 10.7586 21.9506 10.8732 22.0256C10.9878 22.1006 11.1177 22.1401 11.25 22.1401C11.3823 22.1401 11.5122 22.1006 11.6268 22.0256C11.7414 21.9506 11.8367 21.8427 11.9031 21.7127C12.2518 21.0296 13.0217 20.797 13.6229 21.1933C14.224 21.5895 14.4286 22.4646 14.0799 23.1477C13.7923 23.7111 13.3795 24.1787 12.8829 24.5038C12.3862 24.8289 11.8231 25 11.25 25C10.6769 25 10.1138 24.8289 9.61711 24.5038C9.12045 24.1787 8.70767 23.7111 8.42008 23.1477C8.07138 22.4646 8.27601 21.5895 8.87713 21.1933Z"
                fill="#FE9063"
              />
              <circle
                cx="18"
                cy="6"
                r="5"
                fill="url(#paint0_linear_8_1045)"
                stroke="#FEEADF"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_8_1045"
                  x1="15.8934"
                  y1="-5.17647"
                  x2="23.3834"
                  y2="-3.59332"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#704FFE" />
                  <stop offset="1" stopColor="#523CAD" />
                </linearGradient>
              </defs>
            </svg>
          </a>
          <a href="javascript:void(0);" className="bell-icon menu-toggler">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M5,11h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H5C3.9,3,3,3.9,3,5v4C3,10.1,3.9,11,5,11z" />
              <path d="M5,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2H5c-1.1,0-2,0.9-2,2v4C3,20.1,3.9,21,5,21z" />
              <path d="M13,5v4c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-4C13.9,3,13,3.9,13,5z" />
              <path d="M15,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v4C13,20.1,13.9,21,15,21z" />
            </svg>
          </a> */}
        </div>
      </TopNavBarWrapper>
      <div className="dark-overlay"></div>
      {/* Header End  */}
    </>
  );
}
