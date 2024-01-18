import { useEffect, useState } from "react";
import { formatResourceURL } from "../services/asset-paths";
import { getLoaderImage } from "../services/config-data";

export default function PageLoading() {
  const [bgd, setBgd] = useState(getLoaderImage());

  useEffect(() => {
    setBgd(getLoaderImage());
  }, []);

  return (
    <>
      <div
        id="preloader"
        style={{
          background: `url(${formatResourceURL(bgd)})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        {!bgd && <div className="spinner"></div>}
      </div>
    </>
  );
}
