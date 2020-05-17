import api from "./../../api/post";

const state = {
  posts: [],
};

const getters = {};

const actions = {
  create({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.create(
        data,
        (result) => {
          resolve(result.data);
          commit("addPost", result.data);
        },
        (errors) => reject(errors)
      );
    });
  },
  update({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.update(
        data,
        (result) => {
          resolve(result.data);
          commit("updatePost", data);
        },
        (errors) => reject(errors)
      );
    });
  },
  delete({ commit }, id) {
    return new Promise((resolve, reject) => {
      api.delete(
        id,
        (result) => {
          resolve(result.data);
          commit("deletePost", id);
        },
        (errors) => reject(errors)
      );
    });
  },
};

const mutations = {
  addPost(state, post) {
    state.posts.unshift(post);
  },
  updatePost(state, post) {},
  deletePost(state, postId) {},
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
