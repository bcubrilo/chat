import api from "./../../api/chat";
import _ from "lodash";
import urlJoin from "url-join";

const state = {
  channels: [],
  tmpId: 1
};

const getters = {
  getChannelByUsername: state => username => {
    var channel = state.channels.find(function(ch) {
      return ch.members.find(function(m) {
        return m.user != undefined && m.user.username == username;
      });
    });
    if (channel != undefined) return channel;
    else return null;
  },
  channelName: (state, getters, rootState) => channel => {
    if (channel == null) return null;
    if (channel.members == undefined) return channel.id;
    var peer = channel.members.find(
      m =>
        m.user != null &&
        m.user != undefined &&
        m.user.username != rootState.auth.user.username
    );

    if (peer != null && peer != undefined) {
      return peer.user.name;
    }
    return channel.id;
  },
  peerUsername: (state, getters, rootState) => channel => {
    if (channel.members == undefined) return "";
    var peer = channel.members.find(
      m =>
        m.user != null &&
        m.user != undefined &&
        m.user.username != rootState.auth.user.username
    );

    if (peer != null && peer != undefined) {
      return peer.user.username;
    }
    return "";
  },
  channelImage: (state, getters, rootState) => channel => {
    if (channel == null || channel.members == undefined) return null;
    var peer = channel.members.find(
      m =>
        m.user != null &&
        m.user != undefined &&
        m.user.username !== rootState.auth.user.username
    );

    if (peer != null && peer.user != null && peer.user.profile != null) {
      var profile = peer.user.profile.length > 0 ? peer.user.profile[0] : null;
      if (profile != null && profile.profileImageUrl.length > 0)
        return urlJoin(
          process.env.VUE_APP_IMAGES_REPOSITORY,
          "avatars",
          profile.profileImageUrl
        );
    } else return null;
  },
  channelFirstLetter: (state, getters, rootState) => channel => {
    var name = getters.channelName(channel);
    if (name.length > 0) return name.charAt(0).toUpperCase();
  },
  userAvatar: state => (channelId, userId) => {
    var imageName = "";
    var channel = state.channels.find(ch => ch.id == channelId);
    if (channel != null) {
      var member = channel.members.find(m => m.userId == userId);
      if (member != null) {
        imageName = member.user.profile[0].profileImageUrl;
      }
    }
    if (imageName == null || imageName === undefined) {
      imageName = process.env.VUE_APP_AVATAR_IMAGE;
    }

    var imageUrl = urlJoin(
      process.env.VUE_APP_IMAGES_REPOSITORY,
      "avatars",
      imageName
    );
    return imageUrl;
  },

  unreadMessagesCount: state => channel => {
    return _.sumBy(channel.messages, m => (m.seen === false ? 1 : 0));
  },
  totalUnreadMessaesCount: (state, getters) => {
    var total = 0;
    _.forEach(state.channels, ch => {
      total += getters.unreadMessagesCount(ch);
    });

    return total;
  }
};

const actions = {
  getChannels({ commit }) {
    return new Promise((resolve, reject) => {
      api.getChannels(
        {},
        result => {
          resolve(result);
          commit("setChannels", result.channels);
        },
        errors => {
          reject(errors);
        }
      );
    });
  },
  createChannel({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.createChannel(
        data,
        result => {
          resolve(result);
          let c = result.channel;
          c.members = result.members;
          commit("createChannel", c);
        },
        errors => {
          reject(errors);
        }
      );
    });
  },
  createTmpChannel({ commit, rootState }, peerUsername) {
    var channel = {
      id: 0,
      members: [
        {
          user: {
            username: rootState.auth.user.username
          }
        },
        {
          user: {
            username: peerUsername
          }
        }
      ],
      messages: []
    };
    commit("createChannel", channel);
    return channel;
  },
  saveTmpChannel({ commit, rootState }, channel) {
    return new Promise((resolve, reject) => {
      var receiver = channel.members.find(
        m => m.user.username != rootState.auth.user.username
      );
      api.createChannel(
        { username: receiver.user.username },
        result => {
          var newChannel = result.data;
          commit("updateTmpChannel", {
            rootState: rootState,
            channel: channel,
            newChannel: newChannel
          });
          resolve(result);
        },
        errors => {
          reject(errors);
        }
      );
    });
  },

  deleteChannel({ commit }, channel) {
    return new Promise((resolve, reject) => {
      if (channel.id != undefined) {
        api.deleteChannel(
          {
            id: channel.id
          },
          result => {
            resolve(result);
            commit("removeChannel", channel);
          },
          errors => {
            reject(errors);
          }
        );
      }
    });
  },

  deleteTmpChannel({ commit }, channel) {
    commit("removeChannel", channel);
  },

  saveMessage({ commit, state, rootState }, message) {
    var data = {
      message: message,
      jwt: rootState.auth.token,
      tmpId: state.tmpId
    };
    commit("addMessage", data);
  },
  getChannelMessages({ commit, state, rootState }, data) {
    return new Promise((resolve, reject) => {
      api.getChannelMessages(
        data,
        result => {
          commit("addMessagesBulk", {
            messages: result.data,
            channelId: data.channelId
          });
          resolve(result);
        },

        errors => {
          reject(errors);
        }
      );
    });
  },
  setMessagesSeen({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.setMessagesSeen(
        { messageIds: data.messageIds },
        result => {
          console.log("Allright");
          commit("setMessagesSeen", data);
          resolve(result);
        },
        errors => {
          console.log("Errro......" + errors);
          reject(errors);
        }
      );
    });
  }
};

const mutations = {
  createChannel(state, channel) {
    state.channels.push(channel);
  },
  setChannels(state, channels) {
    if (channels != null) {
      var tmp = _.reverse(
        _.sortBy(channels, ch => {
          if (ch.messages != null && ch.messages.length > 0) {
            return _.last(ch.messages).createdAt;
          } else {
            return ch.createdAt;
          }
        })
      );
      state.channels = tmp;
    }
  },
  removeChannel(state, channel) {
    var index = state.channels.indexOf(channel);
    if (index > -1) {
      state.channels[index] = null;
      state.channels.splice(index, 1);
    }
  },
  updateTmpChannel(state, { rootState, channel, newChannel }) {
    var peer = channel.members.find(
      m => m.user.username != rootState.auth.user.username
    );
    var originalChannel = state.channels.find(function(ch) {
      return ch.members.find(function(m) {
        return m.user != undefined && m.user.username == peer.user.username;
      });
    });
    channel.id = newChannel.id;
    originalChannel.id = newChannel.id;
    originalChannel.members = newChannel.members;
    originalChannel.messages = newChannel.messages;
  },
  addMessage(state, data) {
    let channel = state.channels.find(ch => {
      return ch.id == data.message.channelId;
    });
    if (channel != null) {
      if (channel.messages == null) {
        channel.messages = [];
      }
      data.message.tmpId = state.tmpId++;
      channel.messages.push(data.message);
    }
  },
  addMessagesBulk(state, data) {
    let channel = state.channels.find(ch => {
      return ch != null && ch.id === data.channelId;
    });
    if (channel != null) {
      if (channel.messages == null) {
        channel.messages = [];
      }
    }

    channel.messages = _.concat(data.messages, channel.messages);
  },
  updateMessageData(state, data) {
    let channel = state.channels.find(ch => {
      return ch.id === data.channelId;
    });
    if (channel != null) {
      var msg = channel.messages.find(m => m.tmpId == data.tmpId);
      if (msg != undefined) {
        msg.id = data.messageId;
        msg.createdAt = data.createdAt;
        msg.userId = data.userId;
      }
    }
  },
  receiveMessage(state, message) {
    let channel = state.channels.find(ch => {
      return ch.id == message.channelId;
    });
    if (channel != null) {
      if (channel.messages == null) {
        channel.messages = [];
      }
      channel.messages.push(message);
    }
  },
  incrementTmpId(state) {
    state.tmpId++;
  },
  setMessagesSeen(state, data) {
    var channel = state.channels.find(c => c.id === data.channelId);
    if (channel != null && channel != undefined) {
      var messages = _.filter(
        channel.messages,
        m => _.indexOf(data.messageIds, m.id) > -1
      );
      if (messages != undefined) {
        _.forEach(messages, m => (m.seen = true));
      }
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
