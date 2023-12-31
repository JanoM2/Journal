import state from "./state";
import * as actions from "./actions";
import * as mutations from "./mutations";
import * as getters from "./getters";

const jounarlModule = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state,
};

const authModule = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state,
};

export default jounarlModule;
export { authModule };

// este index es lo que se termina importando en el store
