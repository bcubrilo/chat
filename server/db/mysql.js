const Sequalize = require("sequalize");
const sequalize = new Sequalize("chatandmeet", "root", "", {
  host: "localhost",
  dialect: "mysql"
});
sequalize
  .authenticate()
  .then(() => console.log("Connected to db"))
  .catch(error => console.log("Unable to connect"));
