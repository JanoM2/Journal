import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import journal from "@/modules/daybook/store/journal";
import { journalState } from "../../../tests/unit/mock-data/test-journal-state";
import EntryView from "@/modules/daybook/views/EntryView.vue";
import Swal from "sweetalert2";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe("Pruebas en el EntryView", () => {
  const store = createVuexStore(journalState);
  store.dispatch = jest.fn();

  const mockRouter = {
    push: jest.fn(),
  };

  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallowMount(EntryView, {
      props: {
        id: "-NJ6FxMtbEamA7sBf5MH",
      },
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });
  });

  test("debe de sacar al usuario porque el id no existe", () => {
    const wrapper = shallowMount(EntryView, {
      props: {
        id: "Este ID no existe en el store",
      },
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });

    expect(mockRouter.push).toHaveBeenCalledWith({ name: "no-entry" });
  });

  test("debe de mostrar la entrada correctamente", () => {
    expect(wrapper.html()).toMatchSnapshot();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("debe de borrar la entrada y salir", (done) => {
    Swal.fire.mockReturnValueOnce(Promise.resolve({ isConfirmed: true }));

    wrapper.find(".btn-danger").trigger("click");

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "¿Está seguro?",
      text: "Una vez borrado, no se puede recuperar",
      showDenyButton: true,
      confirmButtonText: "Si, estoy seguro",
    });

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith("journal/deleteEntry", {
        date: 1670864138342,
        id: "-NJ6FxMtbEamA7sBf5MH",
        picture:
          "https://res.cloudinary.com/dnoxyukzk/image/upload/v1670864163/ndijerjarlbf1ujd9eaw.png",
        text: "hola mundo desde firebase",
      });
      expect(mockRouter.push).toHaveBeenCalled();
      done();
    }, 1);
  });
});
