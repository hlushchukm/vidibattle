import PresentationModeBtns from "../ui/PresentationModeBtns";

export default function ProfilePostsContainer() {
  return (
    <>
      <div className="title-bar my-2">
        <h6 className="mb-0">My Posts</h6>
        <div className="dz-tab style-2">
          <PresentationModeBtns />
        </div>
      </div>
      <div className="tab-content" id="myTabContent3">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane3"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex={0}
        >
          <div className="dz-lightgallery style-2" id="lightgallery">
            <a className="gallery-box" href="/assets/images/post/pic1.png">
              <img src="/assets/images/post/pic1.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic2.png">
              <img src="/assets/images/post/pic2.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic3.png">
              <img src="/assets/images/post/pic3.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic4.png">
              <img src="/assets/images/post/pic4.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic5.png">
              <img src="/assets/images/post/pic5.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic6.png">
              <img src="/assets/images/post/pic6.png" alt="image" />
            </a>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane3"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex={0}
        >
          <div className="dz-lightgallery" id="lightgallery-2">
            <a className="gallery-box" href="/assets/images/post/pic4.png">
              <img src="/assets/images/post/pic4.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic3.png">
              <img src="/assets/images/post/pic3.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic2.png">
              <img src="/assets/images/post/pic2.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic1.png">
              <img src="/assets/images/post/pic1.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic9.png">
              <img src="/assets/images/post/pic9.png" alt="image" />
            </a>
            <a className="gallery-box" href="/assets/images/post/pic12.png">
              <img src="/assets/images/post/pic12.png" alt="image" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
