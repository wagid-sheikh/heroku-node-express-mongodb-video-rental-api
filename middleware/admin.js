const config = require("config");

module.exports = function (req, res, next) {
  //401: unauthorised
  //403: forbidden
  if (!config.get("requireAuth")) return next();
  if (!req.user.isAdmin) return res.status(403).send("Access Denied");
  next();
};
