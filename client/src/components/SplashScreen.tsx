export default function SplashScreen() {
  return (
    <>
      <div className="loader-screen" id="">
        <div className="main-screen">
          <div className="circle-2"></div>
          <div className="circle-3"></div>
          <div className="circle-4"></div>
          <div className="circle-5"></div>
          <div className="circle-6"></div>
          <div className="brand-logo">
            <div className="logo">
              <img
                src="/assets/images/vector.svg"
                alt="spoon-1"
                className="wow bounceInDown"
              />
            </div>
            <div id="loading-area" className="loading-page-4">
              <div className="loading-inner">
                <div className="load-text">
                  <span data-text="T" className="text-load">
                    T
                  </span>
                  <span data-text="W" className="text-load">
                    W
                  </span>
                  <span data-text="I" className="text-load">
                    I
                  </span>
                  <span data-text="N" className="text-load">
                    N
                  </span>
                  <span data-text="P" className="text-load">
                    P
                  </span>
                  <span data-text="H" className="text-load">
                    H
                  </span>
                  <span data-text="Y" className="text-load">
                    Y
                  </span>
                  <span data-text="." className="text-load text-primary">
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
