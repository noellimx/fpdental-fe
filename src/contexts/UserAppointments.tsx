import { createContext, useEffect, useState } from "react";
import { Appointment } from "../components/Appointments";

import { APIServerFpDental } from "../endpoints/server/fpdental";
import useAuthService, { CredentialStatus } from "./Auth";

const useGeneralUserAppointmentService = (
  ctxAuth: ReturnType<typeof useAuthService>
) => {
  const [appointmentsBooked, setAppointmentsBooked] = useState<Appointment[]>(
    []
  );

  const refresh = async () => {
    console.log(
      `[useGeneralUserAppointmentService] auth context changed ${JSON.stringify(
        ctxAuth
      )}`
    );
    (async () => {
      console.log(
        `[useGeneralUserAppointmentService] status now is ${ctxAuth.status}`
      );
      if (ctxAuth.status === CredentialStatus.USER_GENERAL) {
        const appointments = await APIServerFpDental.getMyAppointments();
        setAppointmentsBooked(() => appointments);
      }
    })();
  };
  useEffect(() => {
    refresh();
  }, [ctxAuth.status]);
  return {
    appointmentsBooked,
    message: ctxAuth.status,
    refresh,
  };
};
export const GlobalContextGeneralUserAppointment = createContext(
  {} as ReturnType<typeof useGeneralUserAppointmentService>
);
export default useGeneralUserAppointmentService;
