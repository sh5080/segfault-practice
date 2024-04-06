import { recoilPersist } from "recoil-persist";

export const { persistAtom } = recoilPersist({
  key: "segfault-persist",
  storage: localStorage,
});
