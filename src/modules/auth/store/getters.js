export const currentState = (state) => {
  return state.status;
};

export const userName = (state) => {
  // console.log(state.user.name);
  return state.user ? state.user.name : "anonimo"; // ternario
};

// para traer informacion del state y puede procesarse
