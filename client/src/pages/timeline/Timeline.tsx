import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import TimelineHeader from "./components/TimelineHeader";

export default function Timeline() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(false);
  }, []);

  if (pageLoading) {
    return <PageLoading />;
  }
  return (
    <>
      <TimelineHeader />

      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <div className="photo-viewer">
              <ul className="list">
                <li>
                  <a href="explore.html">
                    <img src="/assets/images/post/pic5.png" alt="/" />
                  </a>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic1.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic2.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic3.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic4.png" alt="/" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="list">
                <li>
                  <a href="explore.html">
                    <img src="/assets/images/post/pic6.png" alt="/" />
                  </a>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic7.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic8.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic9.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic10.png" alt="/" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="list">
                <li>
                  <a href="explore.html">
                    <img src="/assets/images/post/pic11.png" alt="/" />
                  </a>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic2.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic5.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic3.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic12.png" alt="/" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="list">
                <li>
                  <a href="explore.html">
                    <img src="/assets/images/post/pic6.png" alt="/" />
                  </a>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic7.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic8.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic9.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic10.png" alt="/" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="list">
                <li>
                  <a href="explore.html">
                    <img src="/assets/images/post/pic11.png" alt="/" />
                  </a>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic2.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic5.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic3.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic12.png" alt="/" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="list">
                <li>
                  <a href="explore.html">
                    <img src="/assets/images/post/pic6.png" alt="/" />
                  </a>
                </li>
                <li>
                  <ul>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic7.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic8.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic9.png" alt="/" />
                      </a>
                    </li>
                    <li>
                      <a href="explore.html">
                        <img src="/assets/images/post/pic10.png" alt="/" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
