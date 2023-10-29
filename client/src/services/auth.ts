export const setUserId = (id: string) => {
  localStorage.setItem("userId", JSON.stringify(id));
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  return localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : null;
};
