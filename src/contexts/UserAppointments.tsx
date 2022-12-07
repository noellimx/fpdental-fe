import { createContext, useContext, useEffect, useState } from "react";
import { GlobalContextAuth } from "./Auth";

const useGeneralUserAppointmentService = () => {
  const { status } = useContext(GlobalContextAuth);
  useEffect(() => {
    console.log(
      `[useGeneralUserAppointmentService] auth status changed ${status}`
    );
  }, [status]);
  return {};
};
export const GlobalContextUserAppointment = createContext(
  {} as ReturnType<typeof useGeneralUserAppointmentService>
);
export default useGeneralUserAppointmentService;
