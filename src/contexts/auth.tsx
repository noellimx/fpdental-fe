import { useCallback, useEffect, useReducer } from "react";
import { createContext } from "react";
import store from "store";

enum Role {
  ADMIN = "admin",
  GENERAL = "general",
  UNKNOWN = "unknown",
}

interface Token {
  id: string;
  username: string;
  role: Role;
  expiry?: string;
}

enum HttpStatusCodes {
  OK = 200,
}
const initCredentialState = () => {
  return {
    mode: {
      password: { password: "", username: "" },
    },
    status: CredentialStatus.UNKNOWN,
  };
};
export enum CredentialStatus {
  UNKNOWN = 0b0001,
  VERIFYING = 0b0010,
  USER_ADMIN = 0b0100,
  USER_GENERAL = 0b1000,
  UNVERIFIED = 0b10000,
  NULL = 0b0000,
}
interface CredentialsState {
  mode: {
    password: { username: string; password: string };
  };
  status: CredentialStatus;
}

const newCredentialStateNull = (): CredentialsState => {
  return {
    mode: {
      password: { username: "", password: "" },
    },
    status: CredentialStatus.NULL,
  };
};

interface CredentialsAction {
  command: string;
  args: CredentialsState;
}

const TOKEN_KEY = "my-token";
const dummyAPIBrowser = (() => {
  return {
    getSessionToken: (): Token => {
      return store.get(TOKEN_KEY);
    },
    setSessionToken: (t: Token) => {
      store.set(TOKEN_KEY, t);
    },
    clearSessionToken: () => {
      store.remove(TOKEN_KEY);
    },
  };
})();

const dummyAPIServer = (() => {
  const _validateTokenWithServer = (token: Token) => {
    return true;
  };
  return {
    isValidToken: async () => {
      const token = dummyAPIBrowser.getSessionToken();
      const is = _validateTokenWithServer(token);
      return is ? { is, token } : { is, token: null };
    },
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

enum CredentialsCommand {
  UPDATE_FIELD_USERNAME = "UPDATE_FIELD_USERNAME",
  UPDATE_FIELD_PASSWORD = "UPDATE_FIELD_PASSWORD",
  SET_STATUS_UNVERIFIED = "SET_STATUS_UNVERIFIED",
  SET_STATUS_VERIFYING = "SET_STATUS_VERIFYING",
  SET_STATUS_USER_ADMIN = "SET_STATUS_USER_ADMIN",
  SET_STATUS_USER_GENERAL = "SET_STATUS_USER_GENERAL",
  SET_USERNAME = "SET_USERNAME",
  LOGOUT = "LOGOUT",
}
const useAuthService = () => {
  const [credentials, dispatchCredentials] = useReducer(
    (state: CredentialsState, action: CredentialsAction) => {
      switch (action.command) {
        case CredentialsCommand.UPDATE_FIELD_USERNAME:
          return {
            ...state,
            mode: {
              ...state.mode,
              password: {
                ...state.mode.password,
                username: action.args.mode.password.username,
              },
            },
          };

        case CredentialsCommand.UPDATE_FIELD_PASSWORD:
          return {
            ...state,
            mode: {
              ...state.mode,
              password: {
                ...state.mode.password,
                password: action.args.mode.password.password,
              },
            },
          };

        case CredentialsCommand.SET_STATUS_UNVERIFIED:
          const newState = { ...state };
          newState.status = CredentialStatus.UNVERIFIED;
          return newState;

        case CredentialsCommand.SET_STATUS_VERIFYING:
          const newState2 = { ...state };
          newState2.status = CredentialStatus.VERIFYING;
          return newState2;

        case CredentialsCommand.SET_STATUS_USER_ADMIN:
          const newState3 = { ...state };
          newState3.status = CredentialStatus.USER_ADMIN;
          return newState3;
        case CredentialsCommand.SET_STATUS_USER_GENERAL:
          const newState6 = { ...state };
          newState6.status = CredentialStatus.USER_GENERAL;
          return newState6;

        case CredentialsCommand.SET_USERNAME:
          const newState4 = { ...state };
          newState4.mode.password.username = action.args.mode.password.username;
          return newState4;

        case CredentialsCommand.LOGOUT:
          const newState5 = { ...state };
          newState5.status = CredentialStatus.UNVERIFIED;
          return newState5;
      }

      return { ...state };
    },
    initCredentialState()
  );

  const setStatusUnverified = () => {
    dispatchCredentials({
      command: CredentialsCommand.SET_STATUS_UNVERIFIED,
      args: newCredentialStateNull(),
    });
  };

  const setStatusUserAdmin = () => {
    dispatchCredentials({
      command: CredentialsCommand.SET_STATUS_USER_ADMIN,
      args: newCredentialStateNull(),
    });
  };

  const setStatusUserGeneral = () => {
    dispatchCredentials({
      command: CredentialsCommand.SET_STATUS_USER_GENERAL,
      args: newCredentialStateNull(),
    });
  };

  const setStatusVerifying = () => {
    dispatchCredentials({
      command: CredentialsCommand.SET_STATUS_VERIFYING,
      args: newCredentialStateNull(),
    });
  };

  const setUsername = (username: string) => {
    const credentials = newCredentialStateNull();

    credentials.mode.password.username = username;

    dispatchCredentials({
      command: CredentialsCommand.SET_USERNAME,
      args: credentials,
    });
  };

  useEffect(() => {
    (async () => {
      console.log("[AuthService] Checking Authentication Status...");
      const token = dummyAPIBrowser.getSessionToken();

      setStatusVerifying();

      if (token === undefined) {
        console.log(
          `[AuthService] Checking Authentication Status... token undefined`
        );
        setStatusUnverified();
      } else {
        console.log(
          `[AuthService] Checking Authentication Status... checking token obtained from local storage against server`
        );

        const response = await dummyAPIServer.isValidToken();

        const { is, token } = response;

        if (token !== null) {
          dummyAPIBrowser.setSessionToken(token);
        } else {
          dummyAPIBrowser.clearSessionToken();
        }
        if (is) {
          console.log(`[AuthService] Authentication Status... good.`);

          const { username, role } = token;

          setUsername(username as string);
          if (role === Role.ADMIN) {
            setStatusUserAdmin();
          } else if (role == Role.GENERAL) {
            setStatusUserGeneral();
          }
        } else {
          console.log(
            `[AuthService] Authentication Status... bad. store will be cleaned.`
          );

          setStatusUnverified();
          dummyAPIBrowser.clearSessionToken();
        }
      }
    })();
  }, []);

  const updateFieldUsername = useCallback((un: string) => {
    dispatchCredentials({
      command: CredentialsCommand.UPDATE_FIELD_USERNAME,
      args: {
        mode: { password: { password: "", username: un } },
        status: CredentialStatus.NULL,
      },
    });
  }, []);

  const updateFieldPassword = useCallback((pw: string) => {
    dispatchCredentials({
      command: CredentialsCommand.UPDATE_FIELD_PASSWORD,
      args: {
        mode: { password: { password: pw, username: "" } },
        status: CredentialStatus.NULL,
      },
    });
  }, []);

  const resetPassword = useCallback(() => {
    updateFieldPassword("");
  }, []);

  const login = useCallback(async () => {
    setStatusVerifying();
    const { username, password } = credentials.mode.password;

    console.log(`[submitting credentials] un -> ${username} `);

    const responsePromise = dummyAPIServer.login(username, password);
    resetPassword();

    const response = await responsePromise;
    const { statusCode } = response;

    if (statusCode === HttpStatusCodes.OK && response.token !== undefined) {
      dummyAPIBrowser.setSessionToken(response.token);

      if (response.token.role == Role.ADMIN) {
        setStatusUserAdmin();
      } else {
        response.token.role == Role.GENERAL;
        setStatusUserGeneral();
      }
    } else {
      dummyAPIBrowser.clearSessionToken();
      setStatusUnverified();
    }
    console.log(`stat 1 :${statusCode}`);
    return statusCode;
  }, [credentials.mode.password.username, credentials.mode.password.password]);

  const logout = () => {
    dummyAPIBrowser.clearSessionToken();
    dispatchCredentials({
      command: CredentialsCommand.LOGOUT,
      args: newCredentialStateNull(),
    });

    resetPassword();
  };
  return {
    fields: {
      username: credentials.mode.password.username,
      password: credentials.mode.password.password,
    },
    updateFieldPassword,
    updateFieldUsername,
    login,
    logout,
    status: credentials.status,
  };
};
export const GlobalContextAuth = createContext(
  {} as ReturnType<typeof useAuthService>
);

export default useAuthService;
