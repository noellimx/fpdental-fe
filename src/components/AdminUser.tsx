import { Button, Checkbox } from "@mui/material";
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
export type ManagedUserSessions = ManagedUserSession[];

const txUserSessionsToManaged = (mu: UserSessions): ManagedUserSession[] =>
  mu.map(({ tokenIds, username }) => ({
    username,
    tokenIds: tokenIds.map((tid) => ({ id: tid, toRevoke: false })),
  }));
const ManagedUserSessionsFC = ({
  userSessions,
  revokeUserSessions,
  refresh,
}: {
  userSessions: UserSessions;
  revokeUserSessions: (_: ManagedUserSessions) => Promise<void>;
  refresh: () => Promise<void>;
}) => {
  const [managedUserSessions, setManagedUserSessions] =
    useState<ManagedUserSessions>([]);

  useEffect(() => {
    setManagedUserSessions(txUserSessionsToManaged(userSessions));
  }, [userSessions]);

  const toggleUserSessionToRevoke = (_username: string, _tokenId: string) => {
    setManagedUserSessions((muS) => {
      return muS.map((mu) => {
        if (mu.username === _username) {
          return {
            username: mu.username,
            tokenIds: mu.tokenIds.map((tId) => {
              if (tId.id === _tokenId) {
                return { id: tId.id, toRevoke: !tId.toRevoke };
              }
              return { ...tId };
            }),
          };
        }

        return mu;
      });
    });
  };

  const revoke = async () => {
    await revokeUserSessions(managedUserSessions).then(refresh).catch(refresh);
  };

  const [revoking, setRevoking] = useState(false);
  return revoking ? (
    <div>Revoking... </div>
  ) : (
    <div>
      <div>
        <div>user sessions {`${managedUserSessions.length}`}</div>

        {managedUserSessions.map((mus, id) => {
          return (
            <div key={`${id}-${mus.username}`}>
              <div
                className="user-session-username"
                key={`${id}-${mus.username}`}
              >
                {mus.username}
              </div>
              {mus.tokenIds.map(({ id: tokenId, toRevoke }) => (
                <div className="user-session-token-id-outer" key={`${tokenId}`}>
                  <div className="user-session-token-id-desc">{tokenId}</div>
                  <Checkbox
                    onClick={() => {
                      toggleUserSessionToRevoke(mus.username, tokenId);
                    }}
                    checked={toRevoke}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          setRevoking(() => true);
          setTimeout(() => {
            revoke().then(() => setRevoking(() => false));
          }, 1000);
        }}
      >
        Revoke Sessions
      </button>
    </div>
  );
};
const UserSessionsFC = () => {
  return (
    <GlobalContextAdministrator.Consumer>
      {({
        userSessions,
        revokeUserSessions,
        refresh,
      }: {
        userSessions: UserSessions;
        revokeUserSessions: (_: ManagedUserSessions) => Promise<void>;
        refresh: () => Promise<void>;
      }) => (
        <ManagedUserSessionsFC
          userSessions={userSessions}
          refresh={refresh}
          revokeUserSessions={revokeUserSessions}
        />
      )}
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
      <div>{`Users [Pane Yet To Implement]`}</div>
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
