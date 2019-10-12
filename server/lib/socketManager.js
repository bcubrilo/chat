const _ = require("lodash");

const userSockets = new Map();

module.exports = {
  addSocket(userId, socket) {
    if (userSockets.has(userId)) {
      let sockets = userSockets.get(userId);
      if (!_.find(sockets, s => s.id == socket.id) == undefined) {
        sockets.push(socket);
      }
    } else {
      userSockets.set(userId, [socket]);
    }
  },
  removeSocket(userId, socket) {
    if (userSockets.has(userId)) {
      let sockets = userSockets.get(userId);
      if (sockets != undefined && sockets.length > 0) {
        _.remove(sockets, s => s.id == socket.id);
        if (sockets.length == 0) {
          userSockets.delete(userId);
        }
      }
    }
  },
  getSockets(userId) {
    if (userSockets.has(userId)) {
      return userSockets.get(userId);
    }
    return null;
  },
  joinChannel(userId, channel) {
    if (userSockets.has(userId)) {
      var sockets = userSockets.get(userId);
      if (sockets != undefined && sockets.length > 0) {
        for (let i = 0; i < sockets.length; i++) {
          try {
            sockets[i].join(channel, function() {
              console.log("------------Room-----------------------");
              console.log(JSON.stringify(sockets[i].rooms));
              console.log("------------------------------");
            });
          } catch (err) {
            console.log("Error while joinig room " + err);
          }
        }
      }
    }
  },

  joinChannels(userId, channels) {
    if (channels != undefined && channels.length > 0) {
      _.each(channels, c => this.joinChannel(userId, c));
    }
  },
  leaveChannel(userId, channel) {
    if (userSockets.has(userId)) {
      var sockets = userSockets.get(userId);
      if (sockets != undefined && sockets.length > 0) {
        _.each(s => {
          s.leave(channel);
        });
      }
    }
  }
};
