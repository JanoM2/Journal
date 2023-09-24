import authApi from "@/api/authApi";

export const createUser = async ({ commit }, user) => {
  const { name, email, password } = user;

  try {
    const { data } = await authApi.post(":signUp", {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, refreshToken } = data;
    await authApi.post(":update", { displayName: name, idToken });

    delete user.password;
    commit("loginUser", { user, idToken, refreshToken });

    return { ok: true, message: true };
  } catch (err) {
    console.log(err.response, err);
    return { ok: false, message: err.response.data.error.message };
  }
};

export const signInUser = async ({ commit }, user) => {
  const { email, password } = user;

  try {
    const { data } = await authApi.post(":signInWithPassword", {
      email,
      password,
      returnSecureToken: true,
    });
    const { displayName, idToken, refreshToken } = data;
    user.name = displayName;

    commit("loginUser", { user, idToken, refreshToken });

    return { ok: true };
  } catch (err) {
    console.log(err.response, err);
    return { ok: false, message: err.response.data.error.message };
  }
};

export const checkAuthentication = async ({ commit }) => {
  const idToken = localStorage.getItem("idToken"),
    refreshToken = localStorage.getItem("idToken");

  if (!idToken) {
    commit("logOut");
    return { ok: false, message: "No hay token en la peticion" };
  }

  try {
    const { data } = await authApi.post(`:lookup`, { idToken });

    const { displayName, email } = data.users[0],
      user = {
        name: displayName,
        email,
      };

    commit("loginUser", { user, idToken, refreshToken });

    return { ok: true };
  } catch (err) {
    commit("logOut");
    return { ok: false, message: err.response.data.error.message };
  }
};

// pueden ser acciones asincronas (async) que van a llamar a una mutacion
