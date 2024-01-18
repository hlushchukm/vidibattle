export const setConfigData = (data: any) => {
  localStorage.setItem("config", JSON.stringify(data));
};

export const setConfigDataByKey = (key: string, data: any) => {
  const config = getAllConfigData();
  config[key] = data;

  setConfigData(config);

  return config;
};

export const getAllConfigData = () => {
  return JSON.parse(localStorage.getItem("config") ?? "{}");
};

export const getConfigByKey = (key: string) => {
  const config = getAllConfigData();
  return config[key] ?? null;
};


