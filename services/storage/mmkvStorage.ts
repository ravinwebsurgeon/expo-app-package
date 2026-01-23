import { MMKV } from "react-native-mmkv";
import type { StateCreator } from "zustand";
import { create as actualCreate } from "zustand";
import { StateStorage, createJSONStorage } from "zustand/middleware";

/* ---------------- MMKV INSTANCE ---------------- */

export const storage = new MMKV({
  id: "app-storage",
});

/* ---------------- RESET REGISTRY ---------------- */

const storeResetFns = new Set<() => void>();

/* ---------------- ZUSTAND STORAGE ADAPTER ---------------- */

const mmkvStateStorage: StateStorage = {
  getItem: (name) => {
    try {
      return storage.getString(name) ?? null;
    } catch (err) {
      console.warn(`MMKV get failed for "${name}"`, err);
      storage.delete(name);
      return null;
    }
  },

  setItem: (name, value) => {
    try {
      storage.set(name, value);
    } catch (err) {
      console.error(`MMKV set failed for "${name}"`, err);
    }
  },

  removeItem: (name) => {
    storage.delete(name);
  },
};

/* ---------------- JSON STORAGE FOR ZUSTAND ---------------- */

export const mmkvJSONStateStorage = createJSONStorage(() => mmkvStateStorage);

/* ---------------- CLEAR HELPERS ---------------- */

export const clearAllStorage = () => {
  storage.clearAll();
};

export const resetAllStores = () => {
  storeResetFns.forEach((fn) => fn());
};

export const clearEverything = () => {
  clearAllStorage();
  resetAllStores();
};

/* ---------------- CUSTOM CREATE (AUTO RESET) ---------------- */

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getInitialState();

    storeResetFns.add(() => {
      store.setState(initialState, true);
    });

    return store;
  };
}) as typeof actualCreate;
