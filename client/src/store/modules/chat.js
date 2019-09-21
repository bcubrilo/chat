import api from "./../../api/chat";

const state = {
  channels: []
};

const getters = {};

const actions = {
  getChannels({ commit }) {
    console.log("Get Channels");
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
