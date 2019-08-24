const { User } = require("../models");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/appconfig");

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24;
  return jwt.sign(user.id, appConfig.authentication.jwtSecret);
}

module.exports = {
  async register(req, res) {
    try {
      console.log("Registering user" + req.body);
      const user = await User.create(req.body);
      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(user)
      });
    } catch (err) {
      res.status(400).send({
        error: "Error while registering user" + err
      });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("Logging user " + email + " " + password);
      const user = await User.findOne({
        where: {
          email: email
        }
      });
      if (!user) {
        return res.status(403).send({
          error: "Incorect credentials"
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(403).send({
          error: "The login information was incorrect"
        });
      }
      console.log("Found user " + user.name);
      res.send({
        data: {
          user: user.toJSON(),
          token: jwtSignUser(user)
        }
      });
    } catch (err) {
      console.log(err);
      res.status(404).send({ error: "Error happend." + err });
    }
  }
};
