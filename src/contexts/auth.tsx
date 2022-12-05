import { useCallback, useReducer } from "react";
import { createContext } from "react";

enum CredentialStatus {
  UNKNOWN = 0b0001,
  VERIFYING = 0b0010,
  USER_ADMIN = 0b0100,
  USER_GENERAL = 0b1000,
  NULL = 0b0000,
}
interface CredentialsState {
  mode: {
    password: { username: string; password: string };
  };
  status: CredentialStatus;
}

interface CredentialsAction {
  command: string;
  args: CredentialsState;
}

enum CredentialsCommand {
  UPDATE_FIELD_USERNAME = "UPDATE_FIELD_USERNAME",
  UPDATE_FIELD_PASSWORD = "UPDATE_FIELD_PASSWORD",
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
      }

      return { ...state };
    },
    {
      mode: {
        password: { password: "", username: "" },
      },
      status: CredentialStatus.UNKNOWN,
    }
  );

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

  const submit = useCallback(() => {
    console.log(
      `[submitting credentials] un -> ${credentials.mode.password.username}`
    );

    resetPassword();
  }, [credentials.mode.password.username]);

  return {
    fields: {
      username: credentials.mode.password.username,
      password: credentials.mode.password.password,
    },
    updateFieldPassword,
    updateFieldUsername,
    submit,
  };
};
export const GlobalContextAuth = createContext(
  {} as ReturnType<typeof useAuthService>
);

export default useAuthService;
