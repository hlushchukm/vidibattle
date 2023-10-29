export default function BlinkingLoadingCircles() {
  return (
    <div className="card-body d-flex justify-content-center">
      <div className="dz-spinner d-flex align-items-center">
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 text-success"
          role="status"
          style={{animationDelay: "100ms"}}
        >
          <span className="sr-only">Loading...</span>
        </div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 text-warning"
          role="status"
          style={{animationDelay: "200ms"}}
        >
          <span className="sr-only">Loading...</span>
        </div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 text-danger"
          role="status"
          style={{animationDelay: "300ms"}}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
