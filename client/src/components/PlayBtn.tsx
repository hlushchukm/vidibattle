export default function PlayBtn() {
  return (
    <>
      <div>
        <div
          className="video-btn"
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-white)",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg
            width="18"
            height="22"
            viewBox="0 0 18 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2L16 11L2 20V2Z"
              stroke="#FE9063"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
}
