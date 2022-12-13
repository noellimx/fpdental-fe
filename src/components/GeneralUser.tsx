import GeneralUserAppointments from "./UserAppointments";

import "./GeneralUser.css";
import { useContext, useState } from "react";
import AvailableAppointments from "./AvailableAppointments";
import useGeneralUserAppointmentService, {
  GlobalContextGeneralUserAppointment,
} from "../contexts/UserAppointments";
import { GlobalContextAuth } from "../contexts/Auth";
enum VIEWS_GENERAL_USER {
  ME = "ME",
  AVAILABLE = "AVAIL",
}
const GeneralUser = ({}: {}) => {
  const authCtx = useContext(GlobalContextAuth);
  const [view, setView] = useState<VIEWS_GENERAL_USER>(VIEWS_GENERAL_USER.ME);

  const [body, buttonText] = ((view) => {
    return [
      (() => {
        if (view === VIEWS_GENERAL_USER.ME) {
          return <GeneralUserAppointments />;
        } else if (view === VIEWS_GENERAL_USER.AVAILABLE) {
          return <AvailableAppointments />;
        }
      })(),
      (() => {
        if (view === VIEWS_GENERAL_USER.ME) {
          return "Go to Available Appointments";
        } else if (view === VIEWS_GENERAL_USER.AVAILABLE) {
          return "Go to My Appointments";
        }
      })(),
    ];
  })(view);

  return (
    <GlobalContextGeneralUserAppointment.Provider
      value={useGeneralUserAppointmentService(authCtx)}
    >
      <div className="general-user">
        {body}

        <div className="toggle-user-view-button-parent">
          <button
            className="toggle-user-view-button"
            onClick={() => {
              setView((v) => {
                switch (v) {
                  case VIEWS_GENERAL_USER.AVAILABLE:
                    return VIEWS_GENERAL_USER.ME;
                  case VIEWS_GENERAL_USER.ME:
                    return VIEWS_GENERAL_USER.AVAILABLE;
                }
              });
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </GlobalContextGeneralUserAppointment.Provider>
  );
};

export default GeneralUser;
