import { Appointment, UuidString } from "../../contexts/UserAppointments";
import {
  APIBrowser,
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
    console.log(
      `[APIServerFpDental::_validateTokenWithServer]${JSON.stringify(token)}`
    );

    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const resp = await instance.post("/auth/is-valid-token", { token });
          const { Is: is } = resp.data;
          console.log(`[APIServerFpDental::_validateTokenWithServer] ?${is}`);

          resolve(is);
        } catch {
          resolve(false);
        }
      }, 500);
    });
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
      const token = APIBrowser.getSessionToken();
      const is = await _validateTokenWithServer(token);
      return is ? { is, token } : { is, token: null };
    },
    getMyAppointments: async (): Promise<Appointment[]> => {
      const token = APIBrowser.getSessionToken();
      const appointments = await _getMyAppointments(token);
      return appointments;
    },

    removeMyAppointment: async (apptId: UuidString) => {
      const token = APIBrowser.getSessionToken();
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
