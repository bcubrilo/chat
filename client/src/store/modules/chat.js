import api from "./../../api/chat";

const state = {
  channels: []
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
    console.log("getter channel name " + JSON.stringify(channel));
    if (channel.members == undefined) return channel.id;
    var peer = channel.members.find(
      m =>
        m.user != null &&
        m.user != undefined &&
        m.user.username != rootState.auth.user.username
    );

    if (peer != null && peer != undefined) {
      return peer.user.username;
    }
    return channel.id;
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
          console.log("Error while fetching channels " + errors);
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
      ]
    };
    commit("createChannel", channel);
    return channel;
  },
  saveTmpChannel({ commit }, channel) {
    return new Promise((resolve, reject) => {
      api.createChannel(
        channel,
        result => {
          resolve(result);
          var newChannel = result.channel;
          commit("updateTmpChannel", channel, newChannel);
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

  saveMessage({ commit, rootState }, message) {
    return new Promise((resolve, reject) => {
      api.saveMessage(
        message,
        result => {
          resolve(result);
          message.id = result.messageId;
          commit("addMessage", message);
        },
        errors => {
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
    state.channels = channels;
  },
  removeChannel(state, channel) {
    var index = state.channels.indexOf(channel);
    if (index > -1) {
      state.channels.splice(index, 1);
    }
  },
  updateTmpChannel(state, rootState, channel, newChannel) {
    console.log("Updating tmp channel");
    var peer = channel.members.find(
      m => m.user.username != rootState.auth.user.username
    );
    console.log("found peer" + JSON.stringify(peer));
    var originalChannel = state.channels.find(function(ch) {
      return ch.members.find(function(m) {
        return m.user != undefined && m.user.username == peer.user.username;
      });
    });
    originalChannel.id = newChannel.id;
    originalChannel.members = newChannel.members;
  },
  addMessage(state, message) {
    let channel = state.channels.find(ch => {
      return ch.id == message.channelId;
    });
    if (channel != null) {
      if (channel.messages == null) {
        channel.messages = [];
      }
      channel.messages.push(message);
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
