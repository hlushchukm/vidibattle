export const setUserId = (id: string) => {
  localStorage.setItem("userId", JSON.stringify(id));
};

export const getUserId = () => {
  return localStorage.getItem("userId")
    ? JSON.parse(localStorage.getItem("userId") ?? "")
    : null;
};

export const getUsername = () => {
  return localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")?.username
    : null;
};

export const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  return localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : null;
};

export const isLoggedIn = () => {
  return getUserId() !== null && getUser() !== null;
};

export const updateUserData = (user: any) => {
  setUser({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    profile_img: user.profile_img,
    username: user.username,
    status: user.status,
    is_complete: user.is_complete,
  });
  setUserId(user._id);
};

export const clearAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
};
