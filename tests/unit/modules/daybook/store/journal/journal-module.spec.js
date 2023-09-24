import { createStore } from "vuex";
import journal from "@/modules/daybook/store/journal";
import { journalState } from "../../../../../../tests/unit/mock-data/test-journal-state";
import authApi from "@/api/authApi";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

describe("Vuex - Pruebas en el Journal Module", () => {
  beforeAll(async () => {
    const { data } = await authApi.post(":signInWithPassword", {
      email: "test@test.com",
      password: "123456",
      returnSecureToken: true,
    });

    localStorage.setItem("idToken", data.idToken);
  });

  // Basicas
  test("este es el estado inicial, debe de tener este state", () => {
    const store = createVuexStore(journalState);
    const { isLoading, entries } = store.state.journal;

    expect(isLoading).toBeFalsy();
    expect(entries).toEqual(journalState.entries);
  });

  test("mutation: setEntries", () => {
    const store = createVuexStore({ isLoading: true, entries: [] });

    store.commit("journal/setEntries", journalState.entries);
    expect(store.state.journal.entries.length).toBe(2);

    expect(store.state.journal.isLoading).toBeFalsy();
  });

  test("mutation: updateEntry", () => {
    const store = createVuexStore(journalState);

    const updateEntry = {
      id: "-NFiiPVfTmkX47NnE21R",
      date: 1667230863875,
      text: "Hola mundo desde mock data",
    };

    store.commit("journal/updateEntry", updateEntry);

    // console.log(store.state.journal.entries.forEach((e) => console.log(e.id)));

    expect(store.state.journal.entries.length).toBe(2);
    expect(
      store.state.journal.entries.find((e) => e.id === updateEntry.id)
    ).toEqual(updateEntry);

    console.log(store.state.journal.entries.id);
  });

  test("mutation: addEntry deleteEntry", () => {
    const store = createVuexStore(journalState);
    const entry = { id: "ABC-123", text: "Hola Mundo" };

    store.commit("journal/addEntry", entry);

    expect(store.state.journal.entries.length).toBe(3);
    expect(store.state.journal.entries).toContainEqual(entry);

    store.commit("journal/deleteEntry", entry.id);

    expect(store.state.journal.entries.length).toBe(2);
    expect(
      store.state.journal.entries.find((e) => e.id === "ABC-123")
    ).toBeFalsy();
  });

  // Dispatch es de Actions Y Commit es de Mutation

  // GETTERS

  test("getter: getEntriesByTerm getEntryById", () => {
    const store = createVuexStore(journalState);

    const [entry1, entry2] = journalState.entries;

    expect(store.getters["journal/getEntriesByTerm"]("").length).toBe(2);
    expect(store.getters["journal/getEntriesByTerm"]("segunda")).toEqual([
      entry2,
    ]);

    expect(
      store.getters["journal/getEntryById"]("-NFiiPVfTmkX47NnE21R")
    ).toEqual(entry1);

    // ACTIONS
  });

  test("actions: loadEntries", async () => {
    const store = createVuexStore({ isLoading: true, entries: [] });

    await store.dispatch("journal/loadEntries");

    expect(store.state.journal.entries.length).toBe(2);
  });

  test("actions: updateEntry", async () => {
    const store = createVuexStore(journalState);

    const updatedEntry = {
      id: "-NFiiPVfTmkX47NnE21R",
      date: 1667230863875,
      text: "Hola mundo desde mock data",
      otroCampo: true,
      otroMas: { a: 1 },
    };

    await store.dispatch("journal/updateEntry", updatedEntry);

    expect(store.state.journal.entries.length).toBe(2);
    expect(
      store.state.journal.entries.find((e) => e.id === updatedEntry.id)
    ).toEqual({
      id: "-NFiiPVfTmkX47NnE21R",
      date: 1667230863875,
      text: "Hola mundo desde mock data",
    });
  });

  /* test("actions: createEntry deleteEntry", async () => {
    const store = createVuexStore(journalState);
    const newEntry = {
      date: 111111111,
      text: "nueva entrada desde las pruebas",
    };

    const id = await store.dispatch("journal/createEntry", newEntry);

    expect(typeof id).toBe("string");
    expect(store.state.journal.entries.find((e) => e.id === id)).toBeTruthy();

    await store.dispatch("journal/deleteEntry", id);
    console.log("new", store.state.journal.entries);
    expect(store.state.journal.entries.find((e) => e.id === id)).toBeFalsy();
  }); */
});
