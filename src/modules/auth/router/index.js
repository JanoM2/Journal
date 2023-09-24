export default {
  name: "auth",
  component: () =>
    import(
      /* webpackChunkName: "Auth Layout" */ "@/modules/auth/layouts/AuthLayout.vue"
    ),
  children: [
    {
      path: "",
      name: "login",
      component: () =>
        import(
          /* webpackChunkName: "Auth Login" */ "@/modules/auth/views/LoginView.vue"
        ),
    },
    {
      path: "/register",
      name: "register",
      component: () =>
        import(
          /* webpackChunkName: "Auth Register" */ "@/modules/auth/views/RegisterView.vue"
        ),
    },
  ],
};
