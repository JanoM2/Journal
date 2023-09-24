import { createStore } from "vuex";
import journal from "@/modules/daybook/store/journal/index";
import authModule from "@/modules/auth/store";

const store = createStore({
  modules: {
    auth: authModule,
    journal,
  },
});

export default store;
