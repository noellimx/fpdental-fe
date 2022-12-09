import { Appointment, UuidString } from "../../contexts/UserAppointments";
import {
  APIBrowser,
  Token,
  TokenBE,
  transformTokenBeToToken,
} from "../browser";
import axios, { AxiosError } from "axios";

type AppointmentBE = {
  Description: string;
  Id: UuidString;
};

const transformAppointmentBEToAppointment = (
  apptB: AppointmentBE
): Appointment => {
  const { Description, Id } = apptB;
  return {
    description: Description,
    id: Id,
  };
};
const transformAppointmentBEToAppointmentMany = (apptBs: AppointmentBE[]) => {
  return apptBs.map(transformAppointmentBEToAppointment);
};

export const APIServerFpDental = (() => {
  const PORT = ":8000";
  const instance = axios.create({
    baseURL: `http://localhost${PORT}`,
    timeout: 2000,
  });

  const _validateTokenWithServer = async (token: Token) => {
    console.log(
      `[APIServerFpDental::_validateTokenWithServer]${JSON.stringify(token)}`
    );

    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const response = await instance.post("/auth/is-valid-token", {
            token,
          });
          const { Is: is } = response.data;
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

    const response = await instance.post("/appointments", { token });

    const { Appointments: appointments }: { Appointments: AppointmentBE[] } =
      response.data;

    console.log(`[_getMyAppointments] ${JSON.stringify(appointments)}`);
    return transformAppointmentBEToAppointmentMany(appointments);
  };

  const _removeAppointment = async (
    id: UuidString,
    token: Token
  ): Promise<boolean> => {
    // TODO

    return new Promise(async (resolve) => {
      try {
        const response = await instance.post("/appointments/release", {
          appointmentId: id,
          token,
        });

        const { data } = response;

        const { Is: is }: { Is: boolean } = data;

        resolve(is);
      } catch {
        resolve(false);
      }
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
          } catch (error) {
            if (axios.isAxiosError(error)) {
              resolve({ statusCode: Number(error.response?.status) });
            }
          }

          resolve({ statusCode: -1 });
        }, 1000)
      );
    },
  };
})();
