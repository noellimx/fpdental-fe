import { useContext, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { CredentialStatus, GlobalContextAuth } from "../contexts/Auth";
import IdentityPane from "./IdentityPane";

import "./Template.css";
export default () => {
  const { status } = useContext(GlobalContextAuth);

  const navigate = useNavigate();

  useEffect(() => {
    if (status === CredentialStatus.USER_GENERAL) {
      navigate("/general-user");
    } else {
      navigate("/");
    }
  }, [status]);
  return (
    <>
      <div className="template">
        <IdentityPane />
        <Outlet />
      </div>
    </>
  );
};
