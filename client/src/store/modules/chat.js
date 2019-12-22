import api from "./../../api/chat";

const state = {
  channels: [],
  tmpIdCounter: 1
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
  }
};

const mutations = {
  createChannel(state, channel) {
    state.channels.push(channel);
  },
  setChannels(state, channels) {
    state.channels = channels;
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
  updateMessageData(state, data) {
    let channel = state.channels.find(ch => {
      return ch.id == data.channelId;
    });
    if (channel != null) {
      console.log("Finding msg with id " + data.tmpId);
      console.log("Sever response " + JSON.stringify(data));
      var msg = channel.messages.find(m => m.tmpId == data.tmpId);
      console.log("Found msg " + JSON.stringify(msg));
      if (msg != undefined) {
        msg.id = data.messageId;
        msg.createdAt = data.createdAt;
      }
      console.log("Updated msg " + JSON.stringify(msg));
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
