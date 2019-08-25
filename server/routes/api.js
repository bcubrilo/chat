var express = require("express");
var passport = require("passport");
var router = express.Router();

var UsersController = require("../controllers/UsersController");

var authPolicy = require("../policies/AuthPolicy");

router.get("/users", authPolicy, UsersController.index);
router.post("/profile", authPolicy, UsersController.saveProfile);
router.get("/profile/:userId", authPolicy, UsersController.getProfile);

module.exports = router;
