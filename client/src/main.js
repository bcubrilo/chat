import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import LandingPage from "./LandingPage.vue";

import MessageComposer from "./components/MessageComposer";
import Channel from "./components/Channel";
import Message from "./components/Message";

Vue.config.productionTip = false;

Vue.component("message-composer", MessageComposer);
Vue.component("chm-channel", Channel);
Vue.component("chm-message", Message);

new Vue({
  vuetify,
  router,
  store,
  render: h => {
    return store.getters["auth/isAuth"] ? h(App) : h(LandingPage);
  }
}).$mount("#app");
