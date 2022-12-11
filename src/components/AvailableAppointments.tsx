import { useEffect, useState } from "react";
import { APIServerAuth } from "../drivers/server";
import AppointmentFC, {
  Appointment,
  _SuspenseParentFC,
  _AppointmentIdParentFC,
  AppointmentButton,
  AppointmentsFC,
  DisplayMode,
} from "./Appointments";
import axios from "axios";

const AvailableAppointment = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const [displayMode, setDisplayMode] = useState(DisplayMode.DEFAULT);
  const { id } = appointment;

  const defaultFC = (
    <>
      <_AppointmentIdParentFC thisid={id} />
      <AppointmentButton
        thiskey={`${id}-button-book`}
        onClickFn={async () => {
          console.log(`[AvailableAppointment] clicked book`);
          setDisplayMode(DisplayMode.SUSPENSE);
          try {
            const ok = await APIServerAuth.bookAppointment(id);
            console.log(`Booked Task? ${ok}`);

            if (ok) {
              console.log(`Booked Task ${id}`);
              setDisplayMode(DisplayMode.HIDDEN);
            } else {
              setDisplayMode(DisplayMode.DEFAULT);
            }
          } catch (error) {
            setDisplayMode(DisplayMode.DEFAULT);

            if (axios.isAxiosError(error)) {
              console.warn("Error booking appointment");
            }
          }
        }}
        textVal={"Book"}
      />
    </>
  );

  const suspenseFC = (
    <_SuspenseParentFC>
      <>Booking</>
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

const AvailableAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    console.log("[useEffect] Available Appointments");
    (async () => {
      const appointments = await APIServerAuth.availableAppointments();
      setAppointments(appointments);
      console.log(
        `[useEffect] Available Appointments ${JSON.stringify(appointments)}`
      );
    })();
  }, []);

  return (
    <>
      <div>Available Appointments</div>
      <AppointmentsFC
        appointments={appointments}
        Component={AvailableAppointment}
      />
    </>
  );
};

export default AvailableAppointments;
