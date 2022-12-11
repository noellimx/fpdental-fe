import axios from "axios";
import { useContext, useState } from "react";
import { GlobalContextAuth } from "../contexts/Auth";
import { GlobalContextUserAppointment } from "../contexts/UserAppointments";

import { APIServerAuth } from "../drivers/server";
import AppointmentFC, {
  _AppointmentIdParentFC,
  _SuspenseParentFC,
  Appointment,
  AppointmentButton,
  AppointmentsFC,
  DisplayMode,
} from "./Appointments";
import "./UserAppointments.css";

const BookedAppointmentFC = ({ appointment }: { appointment: Appointment }) => {
  const [displayMode, setDisplayMode] = useState(DisplayMode.DEFAULT);
  const { id } = appointment;

  const defaultFC = (
    <>
      <_AppointmentIdParentFC thisid={id} />
      <AppointmentButton
        thiskey={`${id}-button-remove`}
        onClickFn={async () => {
          console.log(`[BookedAppointment] clicked`);
          setDisplayMode(DisplayMode.SUSPENSE);
          try {
            const ok = await APIServerAuth.removeMyAppointment(id);

            if (ok) {
              console.log(`Released Task ${id}`);
              setDisplayMode(DisplayMode.HIDDEN);
            } else {
              setDisplayMode(DisplayMode.DEFAULT);
            }
          } catch (error) {
            setDisplayMode(DisplayMode.DEFAULT);

            if (axios.isAxiosError(error)) {
              console.warn("Error releasing appointment");
            }
          }
        }}
        textVal={"Release"}
      />
    </>
  );

  const suspenseFC = (
    <_SuspenseParentFC>
      <>Deleting</>
    </_SuspenseParentFC>
  );
  return (
    <AppointmentFC
      displayMode={displayMode}
      suspenseFC={suspenseFC}
      defaultFC={defaultFC}
    />
  );
};

const BookedAppointmentsFC = ({
  appointmentsBooked,
}: {
  appointmentsBooked: Appointment[];
}) => {
  return (
    <>
      <div>------ Booked Appointments ------</div>
      <AppointmentsFC
        Component={BookedAppointmentFC}
        appointments={appointmentsBooked}
      />
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
      <BookedAppointmentsFC appointmentsBooked={appointmentsBooked} />
    </div>
  );
};
