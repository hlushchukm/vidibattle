export const setUserId = (id: string) => {
  sessionStorage.setItem("userId", JSON.stringify(id));
  localStorage.setItem("userId", JSON.stringify(id));
};

export const getUserId = () => {
  if (sessionStorage.getItem("userId")) {
    return JSON.parse(sessionStorage.getItem("userId") ?? "");
  }

  if (localStorage.getItem("userId")) {
    return JSON.parse(localStorage.getItem("userId") ?? "");
  }

  return null;
};

export const getUsername = () => {
  return getUser()?.username;
};

export const setUser = (user: any) => {
  sessionStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  if (sessionStorage.getItem("user")) {
    return JSON.parse(sessionStorage.getItem("user") ?? "");
  }

  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user") ?? "");
  }

  return null;
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
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
};
