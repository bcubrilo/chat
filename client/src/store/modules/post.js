import api from "./../../api/post";
import _ from "lodash";
const state = {
  posts: [],
};

const getters = {
  posts: (state) => state.posts,
};

const actions = {
  createPost({ commit }, data) {
    return new Promise((resolve, reject) => {
      console.log("Send post to server");
      api.create(
        data,
        (result) => {
          resolve(result.post);
          commit("addPost", result.post);
        },
        (errors) => reject(errors)
      );
    });
  },
  updatePost({ commit }, data) {
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
  getRecentPosts({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.recentPosts(
        {
          time:
            state.posts && state.posts.length > 0
              ? _.maxBy(state.posts, (p) => p.createdAt).createdAt
              : null,
        },
        (result) => {
          resolve(result.posts);
          commit("addPosts", result.posts);
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
  addPosts(state, posts) {
    if (posts && posts.length > 0) {
      _.forEach(posts, (p) => {
        if (!_.find(state.posts, { id: p.id })) {
          state.posts.unshift(p);
        }
      });
    }
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
