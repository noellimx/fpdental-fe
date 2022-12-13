import { HttpStatusCodes, Role } from "../../contexts/Auth";
import { Appointment } from "../../components/Appointments";

import { Token } from "../browser";
import { APIBrowser } from "../../drivers/browser";
import { UuidString } from "../../utils/uuid";
import { UserSessions } from "./fpdental";
interface InterfaceGetDummyAppointments {
  [key: string]: {
    get: () => Appointment[];

    remove: (id: UuidString) => boolean;
  };
}

const t1 = {
  id: "d557c96c-ae2e-40a1-bc45-bd1b05e52f46",
  description: "user1_appt_1",
};

const t2 = {
  id: "652d5ac0-dc0f-4763-9b06-4c67bcacf6da",
  description: "user2_appt_1",
};
const genDb = (appts: Appointment[]) => {
  appts = appts.map((appt) => ({ ...appt }));
  return {
    count: () => {
      return appts.length;
    },
    get: (): Appointment[] => {
      console.log(`[appts] ${JSON.stringify(appts)}`);
      return appts;
    },
    remove: (idTarget: UuidString) => {
      const _appts = [];
      let existsAndOmitted = false;
      for (const appt of appts) {
        if (appt.id !== idTarget) {
          _appts.push(appt);
        } else {
          existsAndOmitted = true;
        }
      }
      appts = _appts;

      console.log(`[after remove] ${JSON.stringify(appts)}`);
      return existsAndOmitted;
    },
  };
};
const DummyAppointments: InterfaceGetDummyAppointments = {
  user1: genDb([t1]),
  user2: genDb([t2]),
};
export const APIServerMock = (() => {
  const _validateTokenWithServer = async (token: Token) => {
    return token && true;
  };

  const _getMyAppointments = async (token: Token) => {
    const getFn = DummyAppointments[token.username]?.get;
    const appointments = getFn ? getFn() : [];
    return appointments;
  };

  const _removeAppointment = async (
    id: UuidString,
    token: Token
  ): Promise<boolean> => {
    const dbuser = DummyAppointments[token.username];

    return new Promise((resolve) => {
      if (dbuser) {
        resolve(dbuser.remove(id));
      } else {
        resolve(false);
      }
    });
  };
  return {
    isValidToken: async (): Promise<{ is: boolean; token: null | Token }> => {
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
    availableAppointments: async (): Promise<Appointment[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const some: Appointment[] = [
            {
              description: "mock avail appt",
              id: "c430d6f5-f206-47d6-bb13-b5603772b4a0",
            },
          ];
          resolve(some);
        }, 1000);
      });
    },
    getUserSessions: async (): Promise<UserSessions> => {
      return [];
    },

    bookAppointment: async (id: string): Promise<boolean> => {
      return false;
    },

    revokeUserSessions: async (usS: UserSessions): Promise<void> => {},
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
