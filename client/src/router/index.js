import Vue from "vue";
import Router from "vue-router";

import Register from "../pages/RegisterPage";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/register",
      name: "register",
      component: Register
    }
  ]
});
