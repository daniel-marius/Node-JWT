const express = require("express");
const router = express.Router();
const {
  getPosts,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/routes");

const auth = require("../middlewares/auth-middleware");

// Protected route
// If the auth verification process passes, you will be able to get a response
router.get("/posts", auth, getPosts);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router
  .route("/:userId")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
