import { atom, useRecoilValue } from "recoil";

import { persistAtom } from "./index";

export const userState = atom({
  key: "user",
  default: { name: null },
  effects_UNSTABLE: [persistAtom],
});

export function useUser() {
  const user = useRecoilValue(userState);

  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return user;
}
