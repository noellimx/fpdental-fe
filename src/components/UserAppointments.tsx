import { useContext, useState } from "react";
import { GlobalContextAuth } from "../contexts/Auth";
import {
  Appointment,
  GlobalContextUserAppointment,
} from "../contexts/UserAppointments";

import { APIServerAuth } from "../drivers/server";
import "./UserAppointments.css";

enum DisplayMode {
  DEFAULT = 1,
  SUSPENSE = 2,
  HIDDEN = 3,
}
const BookedAppointment = ({ appointment }: { appointment: Appointment }) => {
  const [displayMode, setDisplayMode] = useState(DisplayMode.DEFAULT);
  const { id } = appointment;

  switch (displayMode) {
    case DisplayMode.DEFAULT:
      return (
        <>
          <div>
            <div key={`${id}-appointments-id`}>id: {id}</div>
            <button
              key={`${id}-button-remove`}
              onClick={async () => {
                console.log(`[BookedAppointment] clicked`);
                setDisplayMode(DisplayMode.SUSPENSE);
                const ok = await APIServerAuth.removeMyAppointment(id);

                if (ok) {
                  setDisplayMode(DisplayMode.HIDDEN);
                } else {
                  setDisplayMode(DisplayMode.DEFAULT);
                }
              }}
            >
              Release
            </button>
          </div>
        </>
      );
    case DisplayMode.SUSPENSE:
      return <>Deleting</>;
    case DisplayMode.HIDDEN:

    default:
      return <></>;
  }
};
const BookedAppointments = ({
  appointmentsBooked,
}: {
  appointmentsBooked: Appointment[];
}) => {
  return (
    <>
      <div>------ Booked Appointments ------</div>

      {appointmentsBooked.map((appointment) => {
        return (
          <BookedAppointment
            key={`${appointment.id}-appointments-item`}
            appointment={appointment}
          />
        );
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
    `[UserAppointments Component] ${status} ${JSON.stringify(
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
