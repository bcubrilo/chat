var express = require("express");
var router = express.Router();

var UsersController = require("../controllers/UsersController");

var authPolicy = require("../policies/AuthPolicy");

router.get("/users", UsersController.index);
router.post("/update-profile", UsersController.updateProfile);

module.exports = router;
