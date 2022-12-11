import { Dispatch, SetStateAction, useContext, useState } from "react";
import { GlobalContextAuth } from "../contexts/Auth";
import "./IdentityPane.css";

import { CredentialStatus } from "../contexts/Auth";
import DevIdentityTable from "./DevIdentityTable";

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
  const { login } = useContext(GlobalContextAuth);

  return (
    <>
      <button
        className="login-button-submit"
        onClick={async () => {
          const statusCode = await login();

          setStatusCode(() => statusCode);
        }}
      >
        Login
      </button>
    </>
  );
};

const LoginFormEditable = ({
  setStatusCode,
  statusCode,
}: {
  setStatusCode: Dispatch<SetStateAction<number>>;
  statusCode: number;
}) => {
  const { status } = useContext(GlobalContextAuth);

  return (
    <>
      {" "}
      <div className="login-form-inner">
        <_inputUsername />
        <_inputPassword />
        <_buttonSubmit setStatusCode={setStatusCode} />
      </div>
      {status === CredentialStatus.UNVERIFIED && statusCode > 0 && (
        <div>{statusCode}</div>
      )}
    </>
  );
};

const LoginFormReadonly = () => {
  const {
    fields: { username },

    logout,
  } = useContext(GlobalContextAuth);

  return (
    <div className="login-form-read-only">
      <div> Logged In As : {username}</div>
      <button className="login-button-logout" onClick={logout}>
        Logout
      </button>
    </div>
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
  const [statusCode, setStatusCode] = useState(-1);

  let body = <div> {status} unimplemented </div>;
  let containerClassName = "";
  const containerClassNameSplit = "login-form-container";
  const containerClassNameWide =
    "login-form-container login-form-container-wide";
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
      containerClassName = containerClassNameWide;
      break;

    case CredentialStatus.USER_ADMIN:
    case CredentialStatus.USER_GENERAL:
      body = <LoginFormReadonly />;
      containerClassName = containerClassNameSplit;
      break;
    case CredentialStatus.UNKNOWN:
      body = <div>User has unknown role.</div>;
      containerClassName = containerClassNameWide;

      break;
    case CredentialStatus.UNVERIFIED:
      containerClassName = containerClassNameWide;
      body = (
        <>
          <LoginFormEditable
            statusCode={statusCode}
            setStatusCode={setStatusCode}
          />
          <DevIdentityTable />
        </>
      );
      break;
  }
  return (
    <div className={containerClassName}>
      <div className="login-form-body">Login Form</div>
      {body}

      <div></div>
    </div>
  );
};
