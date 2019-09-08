var express = require("express");
var passport = require("passport");
var multer = require("multer");
var router = express.Router();

var UsersController = require("../controllers/UsersController");
var ChatsController = require("../controllers/ChatsController");

var authPolicy = require("../policies/AuthPolicy");

var fileUpload = multer({ dest: "./public/uploads" }).single("file");

router.get("/users", authPolicy, UsersController.index);
router.post("/profile", authPolicy, UsersController.saveProfile);
router.get("/profile/:userId", authPolicy, UsersController.getProfile);
router.post("/profile/update", authPolicy, UsersController.updateProfile);
router.post(
  "/profile/upload-profile-image",
  [authPolicy, fileUpload],
  UsersController.uploadProfileImage
);

router.post("/chat/create-channel", authPolicy, ChatsController.createChannel);
router.post("/chat/save-message", authPolicy, ChatsController.saveMessage);
router.post("/chat/delete-message", authPolicy, ChatsController.deleteMessage);

module.exports = router;
