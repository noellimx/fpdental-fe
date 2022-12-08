//

import { HttpStatusCodes, Role } from "../../contexts/Auth";
import { Appointment, UuidString } from "../../contexts/UserAppointments";
import { dummyAPIBrowser, Token } from "../browser";
export const dummyAPIServer = (() => {
  const _validateTokenWithServer = async (token: Token) => {
    // TODO
    return token && true;
  };

  const _getMyAppointments = async (token: Token): Promise<Appointment[]> => {
    // TODO
    const appointments: Appointment[] = [];
    return appointments;
  };

  const _removeAppointment = async (
    id: UuidString,
    token: Token
  ): Promise<boolean> => {
    // TODO
    return new Promise((resolve) => {
      resolve(false);
    });
  };
  return {
    isValidToken: async () => {
      const token = dummyAPIBrowser.getSessionToken();
      const is = await _validateTokenWithServer(token);
      return is ? { is, token } : { is, token: null };
    },
    getMyAppointments: async (): Promise<Appointment[]> => {
      const token = dummyAPIBrowser.getSessionToken();
      const appointments = await _getMyAppointments(token);
      return appointments;
    },

    removeMyAppointment: async (apptId: UuidString) => {
      const token = dummyAPIBrowser.getSessionToken();
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(_removeAppointment(apptId, token));
        }, 300);
      });
    },

    login: async (
      un: string,
      pw: string
    ): Promise<{ statusCode: number; token?: Token }> => {
      // TODO
      return new Promise((resolve) =>
        setTimeout(() => {
          console.log(`[API-login] ${un} `);
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
