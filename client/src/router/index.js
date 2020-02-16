import Vue from "vue";
import Router from "vue-router";

import Register from "../pages/auth/RegisterPage";
import Login from "../pages/auth/LoginPage";
import Home from "../pages/HomePage";
import UserProfile from "../pages/UserProfilePage";
import Chat from "../pages/ChatPage";
import PublicUserProfile from "../pages/UserPublicProfilePage";
import Search from "../pages/Search";
import store from "../store";

Vue.use(Router);

const router = new Router({
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
    },
    {
      path: "/chat/:peerUsername?",
      name: "chat",
      component: Chat,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: "/user/profile/:username",
      name: "user-profile",
      component: PublicUserProfile,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: "/search/:keywords",
      name: "search",
      component: Search,
      meta: { requiresAuth: true },
      props: true
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters["auth/isAuth"]) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
