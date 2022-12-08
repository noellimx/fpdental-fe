import { createContext, useContext, useEffect, useState } from "react";
import useAuthService from "./Auth";

const useGeneralUserAppointmentService = (
  ctxAuth: ReturnType<typeof useAuthService>
) => {
  console.log(`${JSON.stringify(ctxAuth)}`);

  console.log(
    `[useGeneralUserAppointmentService - ctxAuth]${JSON.stringify(ctxAuth)}`
  );
  useEffect(() => {
    console.log(
      `[useGeneralUserAppointmentService] auth status changed ${JSON.stringify(
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
