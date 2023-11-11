// Middleware to check if user is authenticated
module.exports.authGuard = (req, res, next) => {
  if (req.isAuthenticated() && !req.user?.is_admin) return next();

  return res.status(401).json({ message: "unauthorized" });
};

module.exports.adminAuthGuard = (req, res, next) => {
  if (req.isAuthenticated() && req.user?.is_admin === true) return next();

  return res.status(401).json({ message: "unauthorized" });
};
