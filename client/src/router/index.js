import Vue from "vue";
import Router from "vue-router";

import Register from "../pages/auth/RegisterPage";
import Login from "../pages/auth/LoginPage";
import Home from "../pages/HomePage";
import UserProfile from "../pages/UserProfile";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/profile",
      name: "profile",
      component: UserProfile
    }
  ]
});
