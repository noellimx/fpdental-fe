import { Role } from "../contexts/Auth";

import store from "store";
const TOKEN_KEY = "my-token";

export interface Token {
  id: string;
  username: string;
  role: Role;
  expiry?: string;
}

export interface TokenBE {
  Id: string;
  Username: string;
  Role: Role;
  Expiry?: string;
}

export const transformTokenBeToToken = (source: TokenBE) => {
  return {
    id: source.Id,
    username: source.Username,
    role: source.Role,
    expiry: source.Expiry,
  };
};

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
