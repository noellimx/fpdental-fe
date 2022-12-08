import { Role } from "../contexts/Auth";

import store from "store";
const TOKEN_KEY = "my-token";

export interface Token {
  id: string;
  username: string;
  role: Role;
  expiry?: string;
}

export const dummyAPIBrowser = (() => {
  return {
    getSessionToken: (): Token => {
      return store.get(TOKEN_KEY);
    },
    setSessionToken: (t: Token) => {
      store.set(TOKEN_KEY, t);
    },
    clearSessionToken: () => {
      store.remove(TOKEN_KEY);
    },
  };
})();
