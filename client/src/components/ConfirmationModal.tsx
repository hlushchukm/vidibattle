export default function ConfirmationModal({
  message,
  modalId,
  disableYesBtn,
  confirmed,
  children,
}: {
  message?: string;
  modalId: string;
  disableYesBtn?: boolean;
  confirmed: () => void;
  children?: any;
}) {
  return (
    <>
      <div className="offcanvas offcanvas-bottom" tabIndex={-1} id={modalId}>
        <button
          id="confirmModalClose"
          type="button"
          className="btn-close drage-close btn-primary"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          title="Close"
        ></button>

        <div className="offcanvas-body container p-3 pb-4">
          {children ? (
            <>{children}</>
          ) : (
            <>
              <h5 className="text-center mb-3">{message}</h5>
            </>
          )}
          <div className="text-center d-flex justify-content-center gap-3">
            <button
              onClick={confirmed}
              className="btn btn-sm px-4 btn-primary"
              disabled={disableYesBtn}
            >
              Yes
            </button>
            <button
              data-bs-dismiss="offcanvas"
              className="btn btn-sm px-4 btn-danger"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
