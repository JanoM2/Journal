import { useStore } from "vuex";
import { computed } from "vue";

const useAuth = () => {
  const store = useStore(),
    createUser = async (user) => {
      const res = await store.dispatch("auth/createUser", user);
      return res;
    };

  const loginUser = async (user) => {
    const res = await store.dispatch("auth/signInUser", user);
    return res;
  };

  const checkAuthStatus = async () => {
    console.log(store);

    const res = await store.dispatch("auth/checkAuthentication");
    return res;
  };

  const logout = () => {
    store.commit("auth/logOut");
    store.commit("journal/clearEntries");
  };

  return {
    logout,
    loginUser,
    createUser,
    checkAuthStatus,
    authStatus: computed(() => store.getters["auth/currentState"]),
    userName: computed(() => store.getters["auth/userName"]),
  };
};

export default useAuth;
