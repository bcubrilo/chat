import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import LandingPage from "./LandingPage.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import MessageComposer from "./components/MessageComposer";
import Channel from "./components/Channel";
import Message from "./components/Message";
import ChatHistroy from "./components/chat/ChatHistory";
import ChatRoom from "./components/chat/ChatRoom";
import ChatMessage from "./components/chat/ChatMessage";
import UserCard from "./components/UserCard";
import ImageCropper from "./components/ImageCropper";
import DefaultLayout from "./layouts/DefaultLayout";
import LandingLayout from "./layouts/LandingLayout";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import _ from "lodash";
import dateFormat from "dateformat";
import { Cropper } from "vue-advanced-cropper";
import { i18n } from "./i18n";

Vue.config.productionTip = false;

Vue.component("message-composer", MessageComposer);
Vue.component("chm-channel", Channel);
Vue.component("chm-message", Message);
Vue.component("chat-history", ChatHistroy);
Vue.component("vue-perfect-scrollbar", VuePerfectScrollbar);
Vue.component("chat-room", ChatRoom);
Vue.component("chat-message", ChatMessage);
Vue.component("user-card", UserCard);
Vue.component("image-cropper", ImageCropper);

Vue.component("default-layout", DefaultLayout);
Vue.component("landing-layout", LandingLayout);
Vue.component("auth-login", Login);
Vue.component("auth-register", Register);

Vue.prototype.$_ = _;
Vue.prototype.$dateFormat = dateFormat;
console.log("i18n", i18n);

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => {
    // return store.getters["auth/isAuth"] ? h(App) : h(LandingPage);
    return h(App);
  },
  components: {
    Cropper
  }
}).$mount("#app");
