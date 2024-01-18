import { useEffect } from "react";
import { formatResourceURL } from "../../services/asset-paths";
import {
  fetchImageConfig,
  getBackgroundImage,
} from "../../services/config-data";
import { useBgdImgStore } from "../../store";
import CompetitionListHeader from "./components/CompetitionListHeader";
import CompetitionsListContainer from "./components/container/CompetitionsListContainer";

export default function CompetitionsList() {
  const bgdImage = useBgdImgStore((s) => s.url);
  const setBgdImage = useBgdImgStore((s) => s.setImage);

  useEffect(() => {
    // add event listener for resize event to handle background image
    setBackgroundImage();
    window.addEventListener("resize", handleScreenResize);

    return () => {
      window.removeEventListener("resize", handleScreenResize);
    };
  }, []);

  const setBackgroundImage = async () => {
    setBackground(); // until new data is fetched, display old one
    await fetchImageConfig();
    setBackground();
  };

  const handleScreenResize = () => {
    setBackground();
  };

  const setBackground = () => {
    const url = formatResourceURL(getBackgroundImage());
    setBgdImage(url);
  };
  return (
    <>
      <CompetitionListHeader />

      <div
        className="page-content min-vh-100 background-image"
        style={{ background: `url(${bgdImage})` }}
      >
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <div className="">
              <CompetitionsListContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
