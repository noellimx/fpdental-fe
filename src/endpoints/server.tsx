import { HttpStatusCodes, Role } from "../contexts/Auth";
import { dummyAPIBrowser, Token } from "./browser";

export const dummyAPIServer = (() => {
  const _validateTokenWithServer = (token: Token) => {
    return true;
  };
  return {
    isValidToken: async () => {
      const token = dummyAPIBrowser.getSessionToken();
      const is = _validateTokenWithServer(token);
      return is ? { is, token } : { is, token: null };
    },
    login: async (
      un: string,
      pw: string
    ): Promise<{ statusCode: number; token?: Token }> => {
      return new Promise((resolve) =>
        setTimeout(() => {
          console.log(`[dummyAPI-login] ${un} `);
          if (un === pw) {
            let role = Role.UNKNOWN;
            if (un === "dummyadmin") {
              role = Role.ADMIN;
            } else {
              role = Role.GENERAL;
            }

            resolve({
              statusCode: HttpStatusCodes.OK,
              token: { id: `${un}12345`, username: un, role },
            });
          } else {
            resolve({ statusCode: 403 });
          }
        }, 1000)
      );
    },
  };
})();
