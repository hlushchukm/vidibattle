import { useEffect, useRef, useState } from "react";

export default function AddPWA({ installPWA }: { installPWA: any }) {
  const canvasRef = useRef<HTMLElement>();
  const backdropRef = useRef<HTMLElement>();

  useEffect(() => {
    if (
      installPWA &&
      (!getPWARemindDate() || getPWARemindDate() <= new Date())
    ) {
      showPWAModal();
    }
  }, []);

  const showPWAModal = () => {
    canvasRef.current?.classList.add("show");
    backdropRef.current?.classList.add("fade", "show");
  };

  const closePWAModal = () => {
    canvasRef.current?.classList.remove("show");
    backdropRef.current?.classList.remove("fade", "show");
  };

  const handleInstallClick = () => {
    if (installPWA) {
      installPWA.prompt();
    }
    closePWAModal();
  };

  const handleCancelClick = () => {
    const today = new Date();
    const remindDate = new Date();
    remindDate.setDate(today.getDate() + 3);

    setPWARemindDate(remindDate);
    closePWAModal();
  };

  const getPWARemindDate = (): Date => {
    const storedDate = localStorage.getItem("PWA_remind_date");
    if (storedDate) return new Date(storedDate);
    else return new Date();
  };

  const setPWARemindDate = (date: Date) => {
    localStorage.setItem("PWA_remind_date", date.toString());
  };

  return (
    <>
      <div
        ref={(el) => (canvasRef.current = el as HTMLElement)}
        className="offcanvas offcanvas-bottom pwa-offcanvas"
      >
        <div className="container">
          <div className="offcanvas-body small">
            <img className="logo" src="/assets/images/icon.png" alt="" />
            <h5 className="title">Twinphy on Your Home Screen</h5>
            <p>
              Install Twinphy social network mobile app to your home screen for
              easy access, just like any other app
            </p>
            <button
              onClick={handleInstallClick}
              type="button"
              className="btn btn-sm btn-primary pwa-btn"
            >
              Add to Home Screen
            </button>
            <button
              onClick={handleCancelClick}
              type="button"
              className="btn btn-sm pwa-close light btn-secondary ms-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
      <div
        ref={(el) => (backdropRef.current = el as HTMLElement)}
        className="offcanvas-backdrop pwa-backdrop"
      ></div>
    </>
  );
}

export function usePwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the default behavior to delay the prompt
      e.preventDefault();
      // Store the install prompt event
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return installPrompt;
}
