import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import userProfile from "./modules/userProfile";
import chat from "./modules/chat";

import createPersistedState from "vuex-persistedstate";
import socket from "../plugins/socket";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState(), socket()],
  modules: {
    auth,
    userProfile,
    chat
  }
});
