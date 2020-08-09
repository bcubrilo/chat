const { User } = require("../models");
var firstNames = require("./data/firstNames");
var lastNames = require("./data/lastNames");
describe("User", async function () {
  describe("#create()", async function () {
    it("should save without error", async function (done) {
      var i = 0;
      while (i++ < 8000) {
        try {
          var name = firstNames[Math.floor(Math.random() * 61)];
          var lastName = lastNames[Math.floor(Math.random() * 61)];
          var username = `${name}.${lastName}${Math.floor(
            Math.random() * 50000
          )}`;
          await User.create({
            name: `${name} ${lastName}`,
            email: `${username}@email.com`,
            password: "Tat#jae123",
            repeat_password: "Tat#jae123",
            username: username,
          });
        } catch (err) {
          console.log("Error creating user:", username);
        }
      }
      done();
    });
  });
});
