import { createContext, useContext, useEffect, useState } from "react";
import { dummyAPIServer } from "../endpoints/server";
import useAuthService from "./Auth";

type UuidString = string;
export type Appointments = {
  description: string;
  id: UuidString;
};
const useGeneralUserAppointmentService = (
  ctxAuth: ReturnType<typeof useAuthService>
) => {
  const [appointmentsBooked, setAppointmentsBooked] = useState<Appointments[]>(
    []
  );
  useEffect(() => {
    console.log(
      `[useGeneralUserAppointmentService] auth context changed ${JSON.stringify(
        ctxAuth
      )}`
    );
    (async () => {
      const appointments = await dummyAPIServer.getMyAppointments();
      setAppointmentsBooked(() => appointments);
    })();
  }, []);
  return {
    appointmentsBooked,
    message: ctxAuth.status,
  };
};
export const GlobalContextUserAppointment = createContext(
  {} as ReturnType<typeof useGeneralUserAppointmentService>
);
export default useGeneralUserAppointmentService;
