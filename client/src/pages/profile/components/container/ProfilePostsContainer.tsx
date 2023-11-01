import PresentationModeBtns from "../ui/PresentationModeBtns";

export default function ProfilePostsContainer({ posts }: { posts: any }) {
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
            {posts.map((post: any) => (
              <a key={post._id} className="gallery-box" href={post.src}>
                <img src={post.src} alt="image" />
              </a>
            ))}
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
            {posts.map((post: any) => (
              <a className="gallery-box" href={post.src}>
                <img src={post.src} alt="image" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
