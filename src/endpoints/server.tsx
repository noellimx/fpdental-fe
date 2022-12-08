import { HttpStatusCodes, Role } from "../contexts/Auth";
import { Appointments } from "../contexts/UserAppointments";
import { dummyAPIBrowser, Token } from "./browser";

interface InterfaceGetDummyAppointments {
  [key: string]: () => Appointments[];
}
const getDummyAppointments: InterfaceGetDummyAppointments = {
  user1: (): Appointments[] => {
    return [
      {
        id: "d557c96c-ae2e-40a1-bc45-bd1b05e52f46",
        description: "user1_appt_1",
      },
    ];
  },

  user2: (): Appointments[] => {
    return [
      {
        id: "652d5ac0-dc0f-4763-9b06-4c67bcacf6da",
        description: "user2_appt_1",
      },
    ];
  },
};
export const dummyAPIServer = (() => {
  const _validateTokenWithServer = (token: Token) => {
    return true;
  };

  const _getMyAppointments = async (token: Token) => {
    const getFn = getDummyAppointments[token.username];
    const appointments = getFn ? getFn() : [];
    return appointments;
  };
  return {
    isValidToken: async () => {
      const token = dummyAPIBrowser.getSessionToken();
      const is = _validateTokenWithServer(token);
      return is ? { is, token } : { is, token: null };
    },
    getMyAppointments: async (): Promise<Appointments[]> => {
      const token = dummyAPIBrowser.getSessionToken();
      const appointments = await _getMyAppointments(token);
      return appointments;
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
