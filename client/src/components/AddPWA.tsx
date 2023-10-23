export default function AddPWA() {
  return (
    <>
      <div className="offcanvas offcanvas-bottom pwa-offcanvas">
        <div className="container">
          <div className="offcanvas-body small">
            <img className="logo" src="assets/images/icon.png" alt="" />
            <h5 className="title">Soziety on Your Home Screen</h5>
            <p>
              Install Soziety social network mobile app template to your home
              screen for easy access, just like any other app
            </p>
            <button type="button" className="btn btn-sm btn-primary pwa-btn">
              Add to Home Screen
            </button>
            <button
              type="button"
              className="btn btn-sm pwa-close light btn-secondary ms-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
      <div className="offcanvas-backdrop pwa-backdrop"></div>
    </>
  );
}
