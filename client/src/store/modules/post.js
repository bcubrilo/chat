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
      api.create(
        data,
        (result) => {
          resolve(result.post);
          if (!result.post.parentPostId) commit("addPost", result.post);
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
  delete({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.delete(
        data,
        (result) => {
          resolve(result.data);
          commit("deletePost", data.postId);
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
  getPost({ state }, data) {
    return new Promise((resolve, reject) => {
      api.get(
        data,
        (result) => resolve(result.post),
        (errors) => reject(errors)
      );
    });
  },
  getPostComments(data) {
    return new Promise((resolve, reject) => {
      api.getComments(
        data,
        (result) => resolve(result.comments),
        (errors) => reject(errors)
      );
    });
  },
};

const mutations = {
  addPost(state, post) {
    console.log("Dobio sam novi komentar", post);
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
  deletePost(state, postId) {
    var index = _.findIndex(state.posts, { id: postId });
    console.log("Deleting post ", postId, index, state.posts);
    if (index > -1) state.posts.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};