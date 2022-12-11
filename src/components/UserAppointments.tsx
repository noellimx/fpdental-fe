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
  AppointmentsTopBarFC,
} from "./Appointments";
import "./Appointments.css";

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
      <div>
        {" "}
        Please refresh webpage for updates on your booked appointments.{" "}
      </div>
      <AppointmentsFC
        Component={BookedAppointmentFC}
        appointments={appointmentsBooked}
      />
    </>
  );
};

export default () => {
  const { appointmentsBooked, refresh } = useContext(
    GlobalContextUserAppointment
  );

  return (
    <>
      <AppointmentsTopBarFC refresh={refresh} desc={"User Appointments"} />
      <BookedAppointmentsFC appointmentsBooked={appointmentsBooked} />
    </>
  );
};
