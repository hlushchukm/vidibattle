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
                  <span data-text="S" className="text-load">
                    S
                  </span>
                  <span data-text="O" className="text-load">
                    O
                  </span>
                  <span data-text="Z" className="text-load">
                    Z
                  </span>
                  <span data-text="I" className="text-load">
                    I
                  </span>
                  <span data-text="E" className="text-load">
                    E
                  </span>
                  <span data-text="T" className="text-load">
                    T
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
