import { checkAuthentication } from "@/modules/auth/store/actions";
import axios from "axios";
import { ContextExclusionPlugin } from "webpack";
import createVuexStore from "../../../mock-data/mock-store";

describe("Vuex: Pruebas en el auth-module", () => {
  test("estado inicial", () => {
    const store = createVuexStore({
      status: "authenticating", // authenticated, not-authenticated, authenticating
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe("authenticating");
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
  });

  test("Mutation: loginUser", () => {
    const store = createVuexStore({
      status: "authenticating", // authenticated, not-authenticated, authenticating
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const payload = {
      user: {
        name: "Jano",
        email: "janomartino@gmail.com",
      },
      idToken: "ABC-123",
      refreshToken: "XYZ-123",
    };

    store.commit("auth/loginUser", payload);

    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe("authenticated");
    expect(user).toEqual({
      name: "Jano",
      email: "janomartino@gmail.com",
    });
    expect(idToken).toBe("ABC-123");
    expect(refreshToken).toBe("XYZ-123");
  });

  test("Mutation: logOut", () => {
    // console.log(localStorage.setItem("idToken", "ABC-123"));
    // console.log(localStorage.setItem("refreshToken", "XYZ-123"));

    const store = createVuexStore({
      status: "authenticating", // authenticated, not-authenticated, authenticating
      user: {
        name: "Jano",
        email: "janomartino@gmail.com",
      },
      idToken: "ABC-123",
      refreshToken: "XYZ-123",
    });

    store.commit("auth/logOut");

    const { status, user, idToken, refreshToken } = store.state.auth;

    expect(status).toBe("not-authenticated");
    expect(user).toEqual(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
    expect(localStorage.getItem("idToken")).toBeFalsy();
    expect(localStorage.getItem("refreshToken")).toBeFalsy();
  });

  test("Getter: username currentState", () => {
    const store = createVuexStore({
      status: "authenticated", // authenticated, not-authenticated, authenticating
      user: { name: "jano", email: "martinojano0@gmail.com" },
      idToken: "ABC-123",
      refreshToken: "XYZ-456",
    });

    expect(store.getters["auth/currentState"]).toBe("authenticated");
    expect(store.getters["auth/userName"]).toBe("jano");
  });

  test("Actions: createUser - Error usuario ya existe", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // authenticated, not-authenticated, authenticating
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const newUser = {
      name: "Test User",
      email: "test@test.com",
      password: "123456",
    };

    const res = await store.dispatch("auth/createUser", newUser),
      { status, user, idToken, refreshToken } = store.state.auth;

    expect(res).toEqual({ ok: false, message: "EMAIL_EXISTS" });
    expect(status).toBe("not-authenticated");
    expect(user).toBeFalsy();
    expect(idToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
  });

  test("Actions: createUser singInUser - crea el usuario", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // authenticated, not-authenticated, authenticating
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const newUser = {
      name: "test user",
      email: "testuser@testuser.com",
      password: "123456",
    };

    await store.dispatch("auth/signInUser", newUser);
    const { idToken } = store.state.auth,
      deleteRes = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBN0CJ0KN6UjXozYqPCLZLKTE59QVEzHh0`,
        { idToken }
      );

    const res = await store.dispatch("auth/createUser", newUser);
    expect(res).toEqual({ ok: true, message: true });

    const { status, user, idToken: token, refreshToken } = store.state.auth;

    expect(status).toBe("authenticated");
    expect(user).toMatchObject({
      name: "test user",
      email: "testuser@testuser.com",
      // password: "123456",
    });
    expect(typeof idToken).toBe("string");
    expect(typeof refreshToken).toBe("string");
  });

  test("Actions: checkAuthentication - POSITIVA", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // authenticated, not-authenticated, authenticating
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const singInResp = await store.dispatch("auth/signInUser", {
      email: "test@test.com",
      password: "123456",
    });
    const { idToken } = store.state.auth;
    store.commit("auth/logOut");

    localStorage.setItem("idToken", idToken);

    const checkResp = await store.dispatch("auth/checkAuthentication");
    const { status, user, idToken: token, refreshToken } = store.state.auth;

    expect(checkResp).toEqual({ ok: true });

    expect(status).toBe("authenticated");
    expect(user).toMatchObject({ name: "test", email: "test@test.com" });
    expect(typeof token).toBe("string");
  });

  test("Actions: checkAuthentication - NEGATIVA", async () => {
    const store = createVuexStore({
      status: "not-authenticated", // authenticated, not-authenticated, authenticating
      user: null,
      idToken: null,
      refreshToken: null,
    });

    localStorage.removeItem("idToken");
    const checkResp1 = await store.dispatch("auth/checkAuthentication");
    expect(checkResp1).toEqual({
      ok: false,
      message: "No hay token en la peticion",
    });

    expect(store.state.auth.user).toBeFalsy();
    expect(store.state.auth.idToken).toBeFalsy();
    expect(store.state.auth.status).toBe("not-authenticated");

    localStorage.setItem("idToken", "ABC-123");
    const checkResp2 = await store.dispatch("auth/checkAuthentication");
    expect(checkResp2).toEqual({ ok: false, message: "INVALID_ID_TOKEN" });
    expect(store.state.auth.status).toBe("not-authenticated");
  });
});
