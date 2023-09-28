import HomeView from "../views/HomeView.vue";
import authRouter from "../modules/auth/router";
import daybookRouter from "../modules/daybook/router/index.js";
import { createRouter, createWebHashHistory } from "vue-router";
import isAuthenticatedGuard from "@/modules/auth/router/auth-guard";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/auth",
    ...authRouter,
  },
  {
    path: "/daybook",
    beforeEnter: [isAuthenticatedGuard],
    ...daybookRouter,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
