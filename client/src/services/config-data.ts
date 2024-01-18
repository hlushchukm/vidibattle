import { get } from "./crud";
import { isWideScreen } from "./device-type";
import {
  getAllConfigData,
  getConfigByKey,
  setConfigData,
} from "./local-config-data";

export const fetchImageConfig = async () => {
  try {
    const res = await get("configuration", {
      keys: ["loading_screen_image", "home_bgd_desktop", "home_bgd_mobile"],
    });

    if (res.data) {
      processConfigData(res.data);
      return res.data;
    }

    return null;
  } catch (e) {
    console.log(e);
  }
};

export const processConfigData = (data: any[]) => {
  const processedData: any = {};
  for (const entry of data) {
    processedData[entry.key] = entry;
  }
  setConfigData(processedData);
};

export const getBackgroundImage = () => {
  const config = getAllConfigData();
  let desktop_url = "";
  let mobile_url = "";

  if (config["home_bgd_desktop"])
    desktop_url = config["home_bgd_desktop"].value ?? "";

  if (config["home_bgd_mobile"])
    mobile_url = config["home_bgd_mobile"].value ?? "";

  return isWideScreen() ? desktop_url : mobile_url;
};

export const getLoaderImage = () => {
  const config = getConfigByKey("loading_screen_image");

  return config ? config.value : "";
};
