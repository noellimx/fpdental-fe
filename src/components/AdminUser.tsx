import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import useAdministratorService, {
  GlobalContextAdministrator,
} from "../contexts/Administrator";
import { GlobalContextAuth } from "../contexts/Auth";
import { UserSession, UserSessions } from "../endpoints/server/fpdental";
import "./AdminUser.css";

const AdminTopBarButton = ({
  desc,
  onClick,
}: {
  desc: string;
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        display: "flex",
        width: "100%",
        color: "black",
        backgroundColor: "pink",
        border: "2px solid white",
        textTransform: "none",
        borderRadius: "0",
      }}
    >
      {desc}
    </Button>
  );
};
const AdminTopBar = ({
  toggleModeSession,
  toggleModeUser,
}: {
  toggleModeSession: () => void;
  toggleModeUser: () => void;
}) => {
  return (
    <div className="admin-top-bar">
      <AdminTopBarButton onClick={toggleModeSession} desc={"sessions"} />
      <AdminTopBarButton onClick={toggleModeUser} desc={"users"} />
    </div>
  );
};

interface ManagedUserSession {
  username: string;
  tokenIds: ManagedToken[];
}
interface ManagedToken {
  id: string;
  toRevoke: boolean;
}
type ManagedUserSessions = ManagedUserSession[];

const txUserSessionsToManaged = (mu: UserSessions): ManagedUserSession[] =>
  mu.map(({ tokenIds, username }) => ({
    username,
    tokenIds: tokenIds.map((tid) => ({ id: tid, toRevoke: false })),
  }));
const ManagedUserSessionsFC = ({
  userSessions,
}: {
  userSessions: UserSessions;
}) => {
  const [managedUserSessions, setManagedUserSessions] =
    useState<ManagedUserSessions>([]);

  useEffect(() => {
    setManagedUserSessions(txUserSessionsToManaged(userSessions));
  }, [userSessions]);

  return (
    <div>
      <div>user sessions {`${managedUserSessions.length}`}</div>

      {managedUserSessions.map((mus, id) => {
        return (
          <div key={`${id}-${mus.username}`}>
            <div key={`${id}-${mus.username}`}>{mus.username}</div>
            {mus.tokenIds.map(({ id }) => (
              <div key={`${id}`}>{id}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
const UserSessionsFC = () => {
  return (
    <GlobalContextAdministrator.Consumer>
      {({ userSessions }: { userSessions: UserSessions }) => {
        console.log(
          `[UserSessionsFC::globalContextAdministrator.Consumer]${userSessions.length}`
        );
        return (
          <ManagedUserSessionsFC
            userSessions={userSessions}
          ></ManagedUserSessionsFC>
        );
      }}
    </GlobalContextAdministrator.Consumer>
  );
};

enum AdminPaneMode {
  SESSIONS_MANAGEMENT = "admin-mode-sessions",
  USERS_MANAGEMENT = "admin-mode-users",
  UNKNOWN = "admin-mode-unknown",
}
const AdminUser = () => {
  console.log(`[AdminUserFC]`);
  const [paneMode, setPaneMode] = useState(AdminPaneMode.UNKNOWN);
  const authCtx = useContext(GlobalContextAuth);
  const adminCtx = useAdministratorService(authCtx);

  const body = ((paneMode) => {
    return paneMode === AdminPaneMode.SESSIONS_MANAGEMENT ? (
      <UserSessionsFC />
    ) : paneMode === AdminPaneMode.USERS_MANAGEMENT ? (
      <div>users</div>
    ) : (
      <div>...</div>
    );
  })(paneMode);
  useEffect(() => {
    setTimeout(() => {
      adminCtx.refresh();
      setPaneMode((_) => {
        return AdminPaneMode.SESSIONS_MANAGEMENT;
      });
    }, 500);
  }, []);

  return (
    <GlobalContextAdministrator.Provider value={adminCtx}>
      <div className="admin-user">
        <AdminTopBar
          toggleModeSession={() => {
            setPaneMode((_) => {
              return AdminPaneMode.SESSIONS_MANAGEMENT;
            });
          }}
          toggleModeUser={() => {
            setPaneMode((_) => {
              return AdminPaneMode.USERS_MANAGEMENT;
            });
          }}
        />

        {body}
      </div>
    </GlobalContextAdministrator.Provider>
  );
};

export default AdminUser;
