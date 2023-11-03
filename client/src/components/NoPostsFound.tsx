import { Link } from "react-router-dom";

export default function NoPostsFound({
  showBtn,
}: {
  showBtn?: boolean;
}) {
  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="icon-bx">
          <img src="/assets/images/icons/camera_icon.png" alt="No Posts Yet" />
        </div>
        <div className="clearfix d-flex flex-column justify-content-center">
          <h2 className="title text-primary">No Post Found</h2>
          {showBtn && (
            <Link
              to={"/create-post"}
              className="btn btn-secondary m-auto w-auto"
            >
              <i className="fa fa-plus fa-lg pe-2"></i>
              <span>Create Post</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
