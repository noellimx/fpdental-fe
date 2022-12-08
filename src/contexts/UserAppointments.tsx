import { createContext, useContext, useEffect, useState } from "react";
import useAuthService from "./Auth";

const useGeneralUserAppointmentService = (
  ctxAuth: ReturnType<typeof useAuthService>
) => {
  useEffect(() => {
    console.log(
      `[useGeneralUserAppointmentService] auth context changed ${JSON.stringify(
        ctxAuth
      )}`
    );
  }, []);
  return {
    message: ctxAuth.status,
  };
};
export const GlobalContextUserAppointment = createContext(
  {} as ReturnType<typeof useGeneralUserAppointmentService>
);
export default useGeneralUserAppointmentService;
