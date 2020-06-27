import api from "../../api/notification";
import _ from "lodash";
const state = {
  notifications: [],
};
const getters = {
  unreadCount: (state) => _.filter(state.notifications, (n) => !n.seen).length,
};
const actions = {
  getUnread({ commit }) {
    return new Promise((resolve, reject) => {
      api.unread(
        {},
        (result) => {
          resolve(result.notifications);
          commit("addNotifications", result.notifications);
        },
        (errors) => reject(errors)
      );
    });
  },
};
const mutations = {
  addNotifications(state, notifications) {
    if (notifications && notifications.length > 0)
      state.notifications.push(...notifications);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
