import { useContext } from "react";
import { GlobalContextAuth } from "../contexts/Auth";
import { GlobalContextUserAppointment } from "../contexts/UserAppointments";

import "./UserAppointments.css";
export default () => {
  const { message } = useContext(GlobalContextUserAppointment);

  const ctx = useContext(GlobalContextAuth);

  const { status } = ctx;

  console.log(
    `[UserAppointment Component] ${status} ${JSON.stringify(
      ctx
    )} msg ${message}`
  );
  return (
    <div className="userappointments">
      <div>
        <div>User's Appointment</div>
        <div>{message}</div>
      </div>
    </div>
  );
};
