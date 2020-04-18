import api from "./../../api/chat";
import _ from "lodash";
import urlJoin from "url-join";

const state = {
  channels: [],
  tmpId: 1,
};

const getters = {
  getChannelByUsername: (state) => (username) => {
    var channel = state.channels.find(function(ch) {
      return ch.members.find(function(m) {
        return m.user != undefined && m.user.username == username;
      });
    });
    if (channel != undefined) return channel;
    else return null;
  },
  channelName: (state, getters, rootState) => (channel) => {
    if (channel == null) return null;
    if (channel.members == undefined) return channel.id;
    var peer = channel.members.find(
      (m) =>
        m.user != null &&
        m.user != undefined &&
        m.user.username != rootState.auth.user.username
    );

    if (peer && peer.user) {
      return peer.user.name;
    }
    return "";
  },
  peerUsername: (state, getters, rootState) => (channel) => {
    if (channel.members == undefined) return "";
    var peer = channel.members.find(
      (m) =>
        m.user != null &&
        m.user != undefined &&
        m.user.username != rootState.auth.user.username
    );

    if (peer != null && peer != undefined) {
      return peer.user.username;
    }
    return "";
  },
  channelImage: (state, getters, rootState) => (channel) => {
    if (!channel) return null;
    var peer = channel.members.find(
      (m) =>
        m.user != null &&
        m.user != undefined &&
        m.user.username !== rootState.auth.user.username
    );
    var imageName = process.env.VUE_APP_AVATAR_IMAGE;
    if (peer && peer.user && peer.user.profile) {
      var profile = peer.user.profile;

      if (profile != null && profile.profileImageUrl)
        imageName = profile.profileImageUrl;
    }
    return urlJoin(process.env.VUE_APP_IMAGES_REPOSITORY, "avatars", imageName);
  },
  channelFirstLetter: (state, getters, rootState) => (channel) => {
    var name = getters.channelName(channel);
    if (name) return name.charAt(0).toUpperCase();
  },
  userAvatar: (state, getters, rootState) => (channelId, username) => {
    var imageName = "";
    var channel = state.channels.find((ch) => ch.id == channelId);
    if (channel != null) {
      var member = channel.members.find((m) => m.user.usename == username);
      if (member != null) {
        imageName = member.user.profile.profileImageUrl;
      }
    }
    if (!imageName) {
      imageName = process.env.VUE_APP_AVATAR_IMAGE;
    }

    var imageUrl = urlJoin(
      process.env.VUE_APP_IMAGES_REPOSITORY,
      "avatars",
      imageName
    );
    return imageUrl;
  },

  unreadMessagesCount: (state) => (channel) => {
    return _.sumBy(channel.messages, (m) => (!m.isMine && !m.seen ? 1 : 0));
  },
  totalUnreadMessaesCount: (state, getters) => {
    var total = 0;
    _.forEach(state.channels, (ch) => {
      total += getters.unreadMessagesCount(ch);
    });

    return total;
  },
};

const actions = {
  getChannels({ commit }) {
    return new Promise((resolve, reject) => {
      api.getChannels(
        {},
        (result) => {
          resolve(result);
          commit("setChannels", result.channels);
        },
        (errors) => {
          reject(errors);
        }
      );
    });
  },
  createChannel({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.createChannel(
        data,
        (result) => {
          resolve(result);
          let c = result.channel;
          c.members = result.members;
          commit("createChannel", c);
        },
        (errors) => {
          reject(errors);
        }
      );
    });
  },
  createTmpChannel({ commit, rootState }, peer) {
    var channel = {
      id: 0,
      members: [
        {
          user: {
            username: rootState.auth.user.username,
            name: rootState.auth.user.name,
          },
        },
        {
          user: {
            username: peer.username,
            name: peer.name,
          },
        },
      ],
      messages: [],
    };
    commit("createChannel", channel);
    return channel;
  },
  saveTmpChannel({ commit, rootState }, channel) {
    return new Promise((resolve, reject) => {
      var receiver = channel.members.find(
        (m) => m.user.username != rootState.auth.user.username
      );
      api.createChannel(
        { username: receiver.user.username },
        (result) => {
          var newChannel = result.data;
          commit("updateTmpChannel", {
            rootState: rootState,
            channel: channel,
            newChannel: newChannel,
          });
          resolve(result);
        },
        (errors) => {
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
            id: channel.id,
          },
          (result) => {
            resolve(result);
            commit("removeChannel", channel);
          },
          (errors) => {
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
      tmpId: state.tmpId,
    };
    commit("addMessage", data);
  },
  getChannelMessages({ commit, state, rootState }, data) {
    return new Promise((resolve, reject) => {
      api.getChannelMessages(
        data,
        (result) => {
          commit("addMessagesBulk", {
            messages: result.messages,
            channelUuId: result.channelUuId,
          });
          resolve(result);
        },

        (errors) => {
          reject(errors);
        }
      );
    });
  },
  setMessagesSeen({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.setMessagesSeen(
        data,
        (result) => {
          commit("setMessagesSeen", data);
          resolve(result);
        },
        (errors) => {
          reject(errors);
        }
      );
    });
  },
};

const mutations = {
  createChannel(state, channel) {
    state.channels.push(channel);
  },
  setChannels(state, channels) {
    if (channels != null) {
      var tmp = _.reverse(
        _.sortBy(channels, (ch) => {
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
      (m) => m.user.username != rootState.auth.user.username
    );
    var originalChannel = state.channels.find(function(ch) {
      return ch.members.find(function(m) {
        return m.user && m.user.username == peer.user.username;
      });
    });
    channel.uuId = newChannel.uuId;
    originalChannel.uuId = newChannel.uuId;
    originalChannel.members = newChannel.members;
    originalChannel.messages = newChannel.messages;
  },
  addMessage(state, data) {
    let channel = state.channels.find((ch) => {
      return ch.uuId == data.message.channelUuId;
    });
    if (channel != null) {
      if (channel.messages == null) {
        channel.messages = [];
      }
      data.message.tmpId = state.tmpId++;
      data.message.isMine = true;
      if (!data.message.createdAt) data.message.createdAt = Date.now();
      channel.messages.push(data.message);
    }
  },
  addMessagesBulk(state, data) {
    let channel = state.channels.find((ch) => {
      return ch != null && ch.uuId === data.channelUuId;
    });
    if (channel != null) {
      if (channel.messages == null) {
        channel.messages = [];
      }
      channel.messages = _.concat(data.messages, channel.messages);
    }
  },
  updateMessageData(state, data) {
    let channel = state.channels.find((ch) => {
      return ch.uuId === data.channelUuId;
    });
    if (channel != null) {
      var msg = channel.messages.find((m) => m.tmpId == data.tmpId);
      if (msg) {
        msg.uuId = data.messageUuId;
        msg.createdAt = data.createdAt;
      }
    }
  },
  receiveMessage(state, data) {
    let channel = state.channels.find((ch) => {
      return ch.uuId == data.channelUuId;
    });
    if (channel) {
      if (!channel.messages) {
        channel.messages = [];
      }
      channel.messages.push(data.message);
    }
  },
  incrementTmpId(state) {
    state.tmpId++;
  },
  setMessagesSeen(state, data) {
    var channel = state.channels.find((c) => c.uuId === data.channelUuId);
    if (channel != null && channel != undefined) {
      var messages = _.filter(
        channel.messages,
        (m) => _.indexOf(data.messageIds, m.uuId) > -1
      );
      if (messages != undefined) {
        _.forEach(messages, (m) => (m.seen = true));
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
