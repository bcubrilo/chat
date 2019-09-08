import api from "./../../api/chat";
import { resolve } from "path";
import { rejects } from "assert";

const state = {
  channels: []
};

const getters = {};

const actions = {
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
  saveMessage({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.saveMessage(
        data,
        result => {
          resolve(result);
          data.id = result.messageId;
          commit("addMessage", data);
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
