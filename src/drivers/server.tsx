import { APIServerMock } from "../endpoints/server/mock";

import { APIServerFpDental } from "../endpoints/server/fpdental";
const modeServerAuth = import.meta.env.VITE_ENV_AUTH_SERVER_API;
export const authServerAPI = (() => {
  if (modeServerAuth === "fpdental") {
    console.log(`[authServerAPI] initialized -> fpdental`);
    return APIServerFpDental;
  }
  if (modeServerAuth === "mock") {
    console.log(`[authServerAPI] initialized -> mock`);
    return APIServerMock;
  }

  throw new Error("Invalid authServerAPI mode.");
})();
