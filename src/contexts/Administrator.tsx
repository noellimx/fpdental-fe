import { useCallback } from "react";
import { createContext, useState } from "react";
import { ManagedUserSessions } from "../components/AdminUser";

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

        setUserSessions(() => [...userSessions]);
      }
    })();
  };

  const revokeUserSessions = async (usS: ManagedUserSessions) => {
    const uSToRevoke: UserSessions = usS
      .map((ms) => {
        return {
          username: ms.username,
          tokenIds: ms.tokenIds
            .filter((tId) => tId.toRevoke)
            .map(({ id }) => id),
        };
      })
      .filter((ms) => ms.tokenIds.length > 0);

    await APIServerFpDental.revokeUserSessions(uSToRevoke);
  };
  return {
    message: ctxAuth.status,
    refresh,
    userSessions,
    revokeUserSessions,
  };
};
export const GlobalContextAdministrator = createContext(
  {} as ReturnType<typeof useAdministratorService>
);
export default useAdministratorService;
