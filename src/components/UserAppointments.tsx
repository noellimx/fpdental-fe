import { useContext } from "react";
import { GlobalContextAuth } from "../contexts/Auth";
import {
  Appointments,
  GlobalContextUserAppointment,
} from "../contexts/UserAppointments";

import "./UserAppointments.css";

const BookedAppointments = ({
  appointmentsBooked,
}: {
  appointmentsBooked: Appointments[];
}) => {
  return (
    <>
      <div>------ Booked Appointments ------</div>

      {appointmentsBooked.map(({ id }) => {
        return <div key={id}>id: {id}</div>;
      })}
    </>
  );
};

export default () => {
  const { message, appointmentsBooked } = useContext(
    GlobalContextUserAppointment
  );

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

        <BookedAppointments appointmentsBooked={appointmentsBooked} />
      </div>
    </div>
  );
};
