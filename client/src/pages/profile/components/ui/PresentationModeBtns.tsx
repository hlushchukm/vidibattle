export default function PresentationModeBtns() {
  return (
    <>
      <ul className="nav nav-tabs" id="myTab3" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="home-tab3"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane3"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3H3V10H10V3Z"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 3H14V10H21V3Z"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 14H14V21H21V14Z"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14H3V21H10V14Z"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab3"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane3"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 6H21"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12H21"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 18H21"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H3.01"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H3.01"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 18H3.01"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    </>
  );
}
