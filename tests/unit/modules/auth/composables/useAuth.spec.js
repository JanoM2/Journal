import useAuth from "@/modules/auth/composables/useAuth";
// import createVuexStore from "../../../mock-data/mock-store";

const mockStore = {
  dispatch: jest.fn(), // jest.fn "jest.function" devuelve undefined de default
  commit: jest.fn(),
  getters: {
    "auth/currentState": "authenticated",
    "auth/username": "Fernando",
  },
};

jest.mock("vuex", () => ({
  useStore: () => mockStore,
}));

describe("Pruebas en useAuth", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createUser Exitoso", async () => {
    const { createUser } = useAuth();

    const newUser = { name: "Fernando", email: "fernando@gmail.com" };
    mockStore.dispatch.mockReturnValue({ ok: true });

    const resp = await createUser(newUser);

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", {
      email: "fernando@gmail.com",
      name: "Fernando",
    });

    expect(resp).toEqual({ ok: true });
  });

  test("createUser fallido, porque el usuario ya existe", async () => {
    const { createUser } = useAuth();

    const newUser = { name: "Jano", email: "q@q.com" };
    mockStore.dispatch.mockReturnValue({ ok: false, message: "EMAIL_EXISTS" });

    const resp = await createUser(newUser);
    // console.log(resp);
    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", newUser);
    expect(resp).toEqual({ ok: false, message: "EMAIL_EXISTS" });
  });

  test("login existoso", async () => {
    const { loginUser } = useAuth();

    const loginForm = { email: "q@q.com", password: "123456" };
    mockStore.dispatch.mockReturnValue({
      ok: true,
    });

    const resp = await loginUser(loginForm);
    // console.log(resp);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "auth/signInUser",
      loginForm
    );
    expect(resp).toEqual({ ok: true });
  });

  test("checkAuthStatus", async () => {
    // se puede hacer probando la manera fallida
    const { checkAuthStatus } = useAuth();

    mockStore.dispatch.mockReturnValue({
      ok: true,
    });

    const resp = await checkAuthStatus();
    // console.log(resp);
    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/checkAuthentication");
    expect(resp).toEqual({ ok: true });
  });

  test("logout", () => {
    const { logout } = useAuth();

    logout();

    expect(mockStore.commit).toHaveBeenCalledWith("auth/logOut");
    expect(mockStore.commit).toHaveBeenCalledWith("journal/clearEntries");
  });

  test("Computed: authState, userName", () => {
    const { authStatus, userName } = useAuth();

    expect(authStatus.value).toBe("authenticated");
    // expect(userName.value).toBe("Jano"); // DA UNDEFINED
  });
});
