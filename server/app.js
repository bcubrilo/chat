var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var passport = require("passport");
var _ = require("lodash");

var userExtension = require("./models_extension/userExtension");
var channelExtension = require("./models_extension/channelExtension");
var chat = require("./models_extension/chat");

var allowedOrigis = "*:*, http://192.168.1.193:*, http://localhost:*";

const socketManager = require("./lib/socketManager");

var io = require("socket.io")(3031, {
  origins: allowedOrigis
});

io.on("connection", function(socket) {
  console.log("Connected socket " + socket.id);
  socket.emit("userconnected", { data: "You are connected now" });
  socket.on("authenticate", async data => {
    if (data != undefined) {
      var userId = userExtension.jwtGetPayload(data);
      if (userId != undefined) {
        socketManager.addSocket(userId, socket);
        socket.userId = userId;
        var channelIds = await channelExtension.findChannelIdsForUser(userId);
        if (channelIds.length > 0) {
          socketManager.joinChannels(userId, channelIds);
        }
      }
    }
  });
  socket.on("disconnect", () => {
    socketManager.removeSocket(socket.userId, socket);
  });

  socket.on("save_message", async data => {
    console.log("Saving message");
    var msgData = await chat.saveMessage(data);
    socket.to(data.message.channelId).emit("new_message", msgData.message);
    socket.emit("update_message_data", {
      messageId: msgData.message.id,
      tmpId: data.tmpId,
      channelId: msgData.message.channelId,
      createdAt: msgData.message.createdAt,
      userId: msgData.message.userId
    });
  });
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api")({
  io: io,
  socketManager: socketManager
});

var app = express();
app.use(cors("http://localhost:8080"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./passport");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use(express.static("public"));
global.__basedir = __dirname;
module.exports = app;
