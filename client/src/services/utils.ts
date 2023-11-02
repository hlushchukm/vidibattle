export const getName = (user: any) => {
  if (!user) {
    return "loading ... ";
  }

  let res = "";
  if (user.first_name) {
    res += user.first_name;
  }

  if (user.last_name) {
    res += " " + user.last_name;
  }

  return res;
};
