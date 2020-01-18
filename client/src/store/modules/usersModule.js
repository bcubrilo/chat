import api from "../../api/user";
import _ from "lodash";
import urlJoin from "url-join";

const state = {
  mostRecentUsers: null,
  users: [],
  searchedUsers: []
};

const getters = {
  getByUsername: state => username => {
    console.log("Calling getByUsername");
    return _.find(state.users, user => user.username == username);
  },
  userAvatar: state => user => {
    if (
      user != null &&
      user.profileImageUrl != null &&
      user.profileImageUrl !== undefined &&
      user.profileImageUrl.length > 0
    ) {
      return urlJoin(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "big_avatars",
        user.profileImageUrl
      );
    } else return null;
  }
};

const actions = {
  getMostRecentUsers({ commit }) {
    return new Promise((resolve, reject) => {
      api.getMostRecentUsers(
        {},
        result => {
          commit("setMostRecentUsers", result.data);
          resolve(result);
        },
        errors => reject(errors)
      );
    });
  },
  getUserByUsername({ commit }, data) {
    console.log("Calling getUserbyUsername");
    return new Promise((resolve, reject) => {
      api.getUserPublicProfile(
        data,
        result => {
          commit("addUser", result.data);
          resolve(result);
        },
        erorrs => reject(erorrs)
      );
    });
  },
  search({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.searchUsers(
        data,
        result => {
          commit("setSearchedUsers", result.data), resolve(result);
        },
        errors => reject(errors)
      );
    });
  }
};

const mutations = {
  setMostRecentUsers(state, data) {
    state.mostRecentUsers = data;
    _.each(data, user => state.users.push(user));
  },
  addUser(state, user) {
    state.users.push(user);
  },
  setSearchedUsers(state, users) {
    state.searchedUsers = users;
    console.log(state.searchedUsers);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
