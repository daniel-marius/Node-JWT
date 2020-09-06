const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseAPI");

const auth = (req, res, next) => {
  // const token = req.header("auth-token");

  const getHeaderAuthorization = req.headers.authorization;

  if (!getHeaderAuthorization || getHeaderAuthorization === undefined) {
    // return res.status(403).json({
    //   sucess: false,
    //   error: "No token! Access denied!"
    // });
    return res
      .status(403)
      .json(error("No token! Access denied!", res.statusCode));
  }

  const token = getHeaderAuthorization.split(" ")[1];

  if (!token || token === undefined) {
    // return res.status(401).json({
    //   sucess: false,
    //   error: "No token! Access denied!"
    // });
    return res
      .status(401)
      .json(error("No token! Access denied!", res.statusCode));
  }

  const jwtSecret = process.env.JWT_SECRET;

  try {
    const verifiedToken = jwt.verify(token, jwtSecret);
    req.user = verifiedToken;
    next();
  } catch (error) {
    // return res.status(400).json({
    //   sucess: false,
    //   error: "Invalid token! Access denied!"
    // });
    return res
      .status(400)
      .json(error("Invalid token! Access denied!", res.statusCode));
  }
};

module.exports = auth;
