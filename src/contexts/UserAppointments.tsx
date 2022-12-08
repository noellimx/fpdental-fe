import { createContext, useContext, useEffect, useState } from "react";
import { dummyAPIServer } from "../endpoints/server/dummy";
import useAuthService, { CredentialStatus } from "./Auth";

export type UuidString = string;
export type Appointment = {
  description: string;
  id: UuidString;
};
const useGeneralUserAppointmentService = (
  ctxAuth: ReturnType<typeof useAuthService>
) => {
  const [appointmentsBooked, setAppointmentsBooked] = useState<Appointment[]>(
    []
  );
  useEffect(() => {
    console.log(
      `[useGeneralUserAppointmentService] auth context changed ${JSON.stringify(
        ctxAuth
      )}`
    );
    (async () => {
      console.log(`status now is ${ctxAuth.status}`);
      if (ctxAuth.status === CredentialStatus.USER_GENERAL) {
        const appointments = await dummyAPIServer.getMyAppointments();
        setAppointmentsBooked(() => appointments);
      }
    })();
  }, [ctxAuth.status]);
  return {
    appointmentsBooked,
    message: ctxAuth.status,
  };
};
export const GlobalContextUserAppointment = createContext(
  {} as ReturnType<typeof useGeneralUserAppointmentService>
);
export default useGeneralUserAppointmentService;
