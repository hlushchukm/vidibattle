export default function BlinkingLoadingCircles() {
  return (
    <div className="card-body d-flex justify-content-center">
      <div className="dz-spinner d-flex align-items-center">
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2"
          role="status"
          style={{ animationDelay: "100ms", color: "#FF671F" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2"
          role="status"
          style={{ animationDelay: "200ms", color: "#FFFFFF" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2"
          role="status"
          style={{ animationDelay: "300ms", color: "#046A38" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
