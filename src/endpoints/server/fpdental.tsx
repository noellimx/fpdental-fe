import { Appointment, UuidString } from "../../contexts/UserAppointments";
import {
  dummyAPIBrowser,
  Token,
  TokenBE,
  transformTokenBeToToken,
} from "../browser";
import axios from "axios";

const PORT = ":8000";
const instance = axios.create({
  baseURL: `http://localhost${PORT}`,
  timeout: 2000,
});

export const APIServerFpDental = (() => {
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
      return new Promise((resolve) =>
        setTimeout(async () => {
          console.log(`[API-login] ${un} `);

          try {
            const response = await instance.post("/auth/login", {
              username: un,
              password: pw,
            });

            const data = response.data;

            const _token: TokenBE = data.Token;
            const resolution = {
              statusCode: response.status,
              token: transformTokenBeToToken(_token),
            };

            console.log(
              `[API-login] Resolution: ${JSON.stringify(resolution)} `
            );

            resolve(resolution);
          } catch {}

          resolve({ statusCode: -1 });
        }, 1000)
      );
    },
  };
})();
