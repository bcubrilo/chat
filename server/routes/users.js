var express = require("express");
var router = express.Router();
var authController = require("../controllers/authenticationController");

var authPolicy = require("../policies/AuthPolicy");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authPolicy);

module.exports = router;
