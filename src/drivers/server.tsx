import { APIServerMock } from "../endpoints/server/mock";
import { APIServerFpDental } from "../endpoints/server/fpdental";
import { APIServer } from "../endpoints/server/typings";

const modeServerAuth = import.meta.env.VITE_ENV_AUTH_SERVER_API;

const MODE_SERVER_AUTH_FPDENTAL = "fpdental";
const MODE_SERVER_AUTH_MOCK = "mock";

export const APIServerAuth: APIServer = (() => {
  if (modeServerAuth === MODE_SERVER_AUTH_FPDENTAL) {
    console.log(`[authServerAPI] initialized -> fpdental`);
    return APIServerFpDental;
  }
  if (modeServerAuth === MODE_SERVER_AUTH_MOCK) {
    console.log(`[authServerAPI] initialized -> mock`);
    return APIServerMock;
  }

  throw new Error("Invalid authServerAPI mode.");
})();
