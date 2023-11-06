import { useEffect } from "react";

export default function BottomModalContainer({
  onClose,
  children,
}: {
  onClose: () => void;
  children: any;
}) {
  useEffect(() => {
    let doc = document.querySelector(".offcanvas-backdrop");
    if (doc) {
      doc.addEventListener("click", backdropClicked);
      return doc.removeEventListener("click", backdropClicked);
    }
  }, []);

  const backdropClicked = () => {
    console.log("clicked");
  };

  return (
    <>
      <div
        className="offcanvas offcanvas-bottom"
        tabIndex={-1}
        id="offcanvasBottomModal"
      >
        <button
          onClick={onClose}
          type="button"
          className="btn-close drage-close btn-primary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          title="Close"
          id="bottomModalClose"
        ></button>

        <div className="offcanvas-body container pb-0">
          <div className="canvas-height mt-4 dz-scroll">{children}</div>
        </div>
      </div>
    </>
  );
}
