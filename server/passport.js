const passport = require("passport");
const { User } = require("./models");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const config = require("./config/appconfig");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.authentication.jwtSecret
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({
          where: {
            id: jwtPayload
          }
        });
        if (!user) {
          return done(new Error(), false);
        }
        return done(null, user);
      } catch (ex) {
        return done(ex, false);
      }
    }
  )
);

module.exports = null;
