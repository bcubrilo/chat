var express = require("express");
var router = express.Router();
var authController = require("../controllers/authenticationController");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
