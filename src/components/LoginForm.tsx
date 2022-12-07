import { Dispatch, SetStateAction, useContext, useState } from "react";
import { GlobalContextAuth } from "../contexts/Auth";
import "./LoginForm.css";

import { CredentialStatus } from "../contexts/Auth";

const shouldAllowEditUsername = (status: CredentialStatus) => {
  if (status === CredentialStatus.UNVERIFIED) {
    return true;
  }

  return false;
};

const shouldAllowViewUsername = (status: CredentialStatus) => {
  if (status === CredentialStatus.UNKNOWN || status === CredentialStatus.NULL) {
    return false;
  }

  return true;
};

const _inputUsername = () => {
  const {
    fields: { username },
    updateFieldUsername,
    status,
  } = useContext(GlobalContextAuth);

  if (shouldAllowViewUsername(status)) {
    return (
      <input
        className="login-field"
        placeholder="username"
        type="text"
        value={username}
        onChange={
          shouldAllowEditUsername(status)
            ? (event) => {
                updateFieldUsername(event.target.value);
              }
            : () => {}
        }
      />
    );
  }
  return <></>;
};
const _inputPassword = () => {
  const {
    fields: { password },
    updateFieldPassword,
    status,
  } = useContext(GlobalContextAuth);

  return status === CredentialStatus.UNVERIFIED ? (
    <input
      className="login-field"
      placeholder="password"
      type="password"
      value={password}
      onChange={(event) => {
        updateFieldPassword(event.target.value);
      }}
    />
  ) : (
    <></>
  );
};

const _buttonSubmit = ({
  setStatusCode,
}: {
  setStatusCode: Dispatch<SetStateAction<number>>;
}) => {
  const { submit } = useContext(GlobalContextAuth);

  return (
    <>
      <button
        onClick={async () => {
          const statusCode = await submit();
          setStatusCode(statusCode);
        }}
      >
        Login
      </button>
    </>
  );
};

const LoginFormEditable = () => {
  const [statusCode, setStatusCode] = useState(-1);

  {
    statusCode === 403 && <div>403</div>;
  }

  return (
    <>
      {" "}
      <_inputUsername />
      <_inputPassword />
      <_buttonSubmit setStatusCode={setStatusCode} />
    </>
  );
};

const LoginFormReadonly = () => {
  const {
    fields: { username },

    logout,
  } = useContext(GlobalContextAuth);

  return (
    <>
      {" "}
      <div> Logged In As : {username}</div>
      <button onClick={logout}>Logout</button>
    </>
  );
};

const LoginFormVerifying = () => {
  return (
    <>
      {" "}
      <div>Verifying...</div>
    </>
  );
};

export default () => {
  const { status } = useContext(GlobalContextAuth);

  let body = <div> unimplemented </div>;

  switch (status) {
    case CredentialStatus.NULL:
      body = (
        <div>
          Component should not be displayed. Please check with developer.
        </div>
      );
      break;
    case CredentialStatus.VERIFYING:
      body = <LoginFormVerifying />;
      break;

    case CredentialStatus.USER_ADMIN || CredentialStatus.USER_GENERAL:
      body = <LoginFormReadonly />;
      break;

    case CredentialStatus.UNVERIFIED:
      body = <LoginFormEditable />;
      break;
  }
  return (
    <div className="login-form-container">
      <div className="login-form-body">Login Form</div>

      {body}
    </div>
  );
};
