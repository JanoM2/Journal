import state from "./state";
import * as actions from "./actions";
import * as mutations from "./mutations";
import * as getters from "./getters";

const myCustomModule = {
  namespaced: true,
  actions,
  mutations,
  getters,
  state,
};

export default myCustomModule;

// este index es lo que se termina importando en el store
