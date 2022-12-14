import { useCallback, useEffect, useReducer } from "react";
import { createContext } from "react";

import { APIBrowser } from "../drivers/browser";

import { APIServerAuth } from "../drivers/server";
export enum Role {
  ADMIN = "Admin",
  GENERAL = "General",
  UNKNOWN = "Unknown",
}

export enum HttpStatusCodes {
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

enum CredentialsCommand {
  UPDATE_FIELD_USERNAME = "UPDATE_FIELD_USERNAME",
  UPDATE_FIELD_PASSWORD = "UPDATE_FIELD_PASSWORD",
  SET_STATUS_UNVERIFIED = "SET_STATUS_UNVERIFIED",
  SET_STATUS_VERIFYING = "SET_STATUS_VERIFYING",
  SET_STATUS_USER_ADMIN = "SET_STATUS_USER_ADMIN",
  SET_STATUS_USER_GENERAL = "SET_STATUS_USER_GENERAL",
  SET_STATUS_UNKNOWN = "SET_STATUS_UNKNOWN",
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

        case CredentialsCommand.SET_STATUS_UNKNOWN:
          const newState7 = { ...state };
          newState7.status = CredentialStatus.UNKNOWN;
          return newState7;

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

  const setStatusUnknown = () => {
    dispatchCredentials({
      command: CredentialsCommand.SET_STATUS_UNKNOWN,
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
      const token = APIBrowser.getSessionToken();

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

        const response = await APIServerAuth.isValidToken();
        console.log(
          `[AuthService] Checking Authentication Status... ${JSON.stringify(
            response
          )}`
        );
        const { is, token: _token } = response;

        if (_token) {
          APIBrowser.setSessionToken(_token);
        } else {
          APIBrowser.clearSessionToken();
        }
        if (is) {
          console.log(`[AuthService] Authentication Status... good.`);

          const { username, role } = _token!;

          setUsername(username as string);
          if (role === Role.ADMIN) {
            setStatusUserAdmin();
          } else if (role == Role.GENERAL) {
            setStatusUserGeneral();
          } else {
            setStatusUnknown();
          }
        } else {
          console.log(
            `[AuthService] Authentication Status... bad. store will be cleaned.`
          );

          setStatusUnverified();
          APIBrowser.clearSessionToken();
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

    const responsePromise = APIServerAuth.login(username, password);
    resetPassword();

    const response = await responsePromise;

    console.log(
      `[login] un -> ${username} Status ok. response ${JSON.stringify(
        response
      )}`
    );
    const { statusCode, token } = response;

    if (statusCode === HttpStatusCodes.OK && token !== undefined) {
      console.log(
        `[login] un -> ${username} Status ok. setting token ${JSON.stringify(
          token
        )}`
      );

      APIBrowser.setSessionToken(token);

      if (token.role == Role.ADMIN) {
        setStatusUserAdmin();
      } else {
        token.role == Role.GENERAL;
        setStatusUserGeneral();
      }
    } else {
      `[login] un -> ${username} Status bad: ${statusCode}.`;
      APIBrowser.clearSessionToken();
      setStatusUnverified();
    }

    console.log(`[login] returning statusCode ${statusCode}`);
    return statusCode;
  }, [credentials.mode.password.username, credentials.mode.password.password]);

  const logout = () => {
    APIBrowser.clearSessionToken();
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
