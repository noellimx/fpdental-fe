import { useCallback, useEffect, useReducer } from "react";
import { createContext } from "react";
import store from "store";

interface Token {
  id: string;
  username: string;
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
    getSessionToken: () => {
      return store.get(TOKEN_KEY);
    },

    clearSessionToken: () => {
      store.remove(TOKEN_KEY);
    },
  };
})();

const dummyAPIServer = (() => {
  const validateTokenWithServer = (token: string) => {
    if (token === "12345") {
      return {
        is: true,
        role: "admin",
        username: "dummyadmin",
      };
    }
    if (token === "abcde") {
      return {
        is: true,
        role: "user",
        username: "dummyuser",
      };
    } else {
      return {
        is: false,
      };
    }
  };
  return {
    isValidToken: async () => {
      const token = dummyAPIBrowser.getSessionToken();
      return validateTokenWithServer(token);
    },
    login: async (
      un: string,
      pw: string
    ): Promise<{ statusCode: number; token?: string }> => {
      return new Promise((resolve) =>
        setTimeout(() => {
          console.log(`[dummyAPI-login] ${un} `);
          if (un === pw) {
            resolve({
              statusCode: HttpStatusCodes.OK,

              token: "12345",
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

        case CredentialsCommand.SET_USERNAME:
          const newState4 = { ...state };
          newState4.mode.password.username = action.args.mode.password.username;
          return newState4;

        case CredentialsCommand.LOGOUT:
          const newState5 = { ...state };
          newState5.mode.password.password = "";
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

      dispatchCredentials({
        command: CredentialsCommand.SET_STATUS_VERIFYING,
        args: newCredentialStateNull(),
      });

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

        const { is } = response;

        if (is) {
          console.log(`[AuthService] Authentication Status... good.`);

          const { username, role } = response;

          setUsername(username as string);
          if (role === "admin") {
            setStatusUserAdmin();
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

  const submit = useCallback(async () => {
    const { username, password } = credentials.mode.password;

    console.log(`[submitting credentials] un -> ${username} `);

    const responsePromise = dummyAPIServer.login(username, password);
    resetPassword();

    const response = await responsePromise;
    const { statusCode } = response;

    console.log(`response ${JSON.stringify(response)}`);

    if (statusCode === HttpStatusCodes.OK) {
      const { token } = response;
    }

    return statusCode;
  }, [credentials.mode.password.username, credentials.mode.password.password]);

  const logout = () => {
    dummyAPIBrowser.clearSessionToken();
    dispatchCredentials({
      command: CredentialsCommand.LOGOUT,
      args: newCredentialStateNull(),
    });
  };
  return {
    fields: {
      username: credentials.mode.password.username,
      password: credentials.mode.password.password,
    },
    updateFieldPassword,
    updateFieldUsername,
    submit,
    logout,
    status: credentials.status,
  };
};
export const GlobalContextAuth = createContext(
  {} as ReturnType<typeof useAuthService>
);

export default useAuthService;
