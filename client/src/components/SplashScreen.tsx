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
            <div className="text-center">
              <img
                src="/assets/images/favicon.png"
                alt="spoon-1"
                className="wow bounceInDown"
                style={{ width: "100px" }}
              />
            </div>
            <div id="loading-area" className="loading-page-4">
              <div className="loading-inner">
                <div className="load-text">
                  <span data-text="V" className="text-load">
                    V
                  </span>
                  <span data-text="I" className="text-load">
                    I
                  </span>
                  <span data-text="D" className="text-load">
                    D
                  </span>
                  <span data-text="I" className="text-load">
                    I
                  </span>
                  <span data-text="B" className="text-load">
                    B
                  </span>
                  <span data-text="A" className="text-load">
                    A
                  </span>
                  <span data-text="T" className="text-load">
                    T
                  </span>
                  <span data-text="T" className="text-load">
                    T
                  </span>
                  <span data-text="L" className="text-load">
                    L
                  </span>
                  <span data-text="E" className="text-load">
                    E
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
