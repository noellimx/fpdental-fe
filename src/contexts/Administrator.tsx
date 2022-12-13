import { useCallback } from "react";
import { createContext, useEffect, useMemo, useState } from "react";

import { APIServerFpDental, UserSessions } from "../endpoints/server/fpdental";
import useAuthService, { CredentialStatus } from "./Auth";

const useAdministratorService = (
  ctxAuth: ReturnType<typeof useAuthService>
) => {
  const [userSessions, setUserSessions] = useState<UserSessions>([]);

  const refresh = async () => {
    console.log(
      `[useAdministratorService] auth context changed ${JSON.stringify(
        ctxAuth
      )}`
    );
    (async () => {
      console.log(`[useAdministratorService] status now is ${ctxAuth.status}`);
      if (ctxAuth.status === CredentialStatus.USER_ADMIN /* GUARD */) {
        console.log(`[useAdministratorService] Checking user sessions... `);
        const userSessions = await APIServerFpDental.getUserSessions();

        console.log(
          `[useAdministratorService]userSessions ${JSON.stringify(
            userSessions
          )}`
        );

        setUserSessions(() => [...userSessions]);
      }
    })();
  };

  return {
    message: ctxAuth.status,
    refresh,
    userSessions,
  };
};
export const GlobalContextAdministrator = createContext(
  {} as ReturnType<typeof useAdministratorService>
);
export default useAdministratorService;
