import GeneralUserAppointments from "./UserAppointments";

import "./GeneralUser.css";
import { useState } from "react";
import AvailableAppointments from "./AvailableAppointments";

enum VIEWS_GENERAL_USER {
  ME = "ME",
  AVAILABLE = "AVAIL",
}
const GeneralUser = () => {
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
  );
};

export default GeneralUser;
