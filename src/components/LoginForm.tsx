import { useContext } from "react";
import { GlobalContextAuth } from "../contexts/auth";
import "./LoginForm.css";

export default () => {
  const {
    fields: { username, password },
    updateFieldPassword,
    updateFieldUsername,
    submit,
  } = useContext(GlobalContextAuth);
  return (
    <div className="login-form-container">
      <div className="login-form-body">Login Form</div>

      <input
        className="login-field"
        placeholder="username"
        type="text"
        value={username}
        onChange={(event) => {
          updateFieldUsername(event.target.value);
        }}
      />
      <input
        className="login-field"
        placeholder="password"
        type="password"
        value={password}
        onChange={(event) => {
          updateFieldPassword(event.target.value);
        }}
      />

      <button onClick={submit}>Login</button>
    </div>
  );
};
