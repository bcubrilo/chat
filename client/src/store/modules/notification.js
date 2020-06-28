import api from "../../api/notification";
import _ from "lodash";
import notification from "../../api/notification";
const state = {
  notifications: [],
};
const getters = {
  unreadCount: (state) => _.filter(state.notifications, (n) => !n.seen).length,
  route: (state) => (notification) => {
    var parts = notification.url.split("/");
    if (parts && parts.length > 1) {
      return {
        name: parts[0],
        params: parts[0] == "post" ? { postId: parts[1] } : {},
      };
    }
    return "";
  },
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
    if (notifications && notifications.length > 0) {
      if (Array.isArray(notifications)) {
        var sorted = _.reverse(
          _.sortBy(notifications, (n) => new Date(n.createdAt))
        );
        console.log("Sorted =>", sorted);
        state.notifications.push(...sorted);
      } else {
        state.notifications.unshift(notifications);
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
