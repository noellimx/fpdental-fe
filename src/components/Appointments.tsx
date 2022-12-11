import React, { PropsWithChildren } from "react";
import { UuidString } from "../utils/uuid";

import "./UserAppointments.css";

export enum DisplayMode {
  DEFAULT = 1,
  SUSPENSE = 2,
  HIDDEN = 3,
}

export type Appointment = {
  description: string;
  id: UuidString;
};

export const AppointmentButton: React.FC<{
  thiskey: string;
  onClickFn: () => Promise<void>;

  textVal: string;
}> = ({ thiskey, onClickFn, textVal }) => {
  return (
    <button
      key={thiskey}
      className={"appointment-button-base"}
      onClick={onClickFn}
    >
      {textVal}
    </button>
  );
};

export type AppointmentFcProps = PropsWithChildren<{
  suspenseFC: React.ReactElement<any>;
  defaultFC: React.ReactElement<any>;
  displayMode: DisplayMode;
}>;

export const AppointmentFC: React.FC<AppointmentFcProps> = ({
  displayMode,
  suspenseFC,
  defaultFC,
}) => {
  const displayFc = ((displayMode) => {
    switch (displayMode) {
      case DisplayMode.DEFAULT:
        return defaultFC;
      case DisplayMode.SUSPENSE:
        return suspenseFC;
      case DisplayMode.HIDDEN:
      default:
        return <></>;
    }
  })(displayMode);

  return <div className="appointment-base">{displayFc}</div>;
};

export const AppointmentsFC: React.FC<{
  appointments: Appointment[];
  Component: React.FC<{ appointment: Appointment }>;
}> = ({ Component, appointments }) => {
  return (
    <>
      {appointments.map((appointment) => {
        return (
          <Component
            key={`${appointment.id}-appointments-item`}
            appointment={appointment}
          />
        );
      })}
    </>
  );
};

export const _SuspenseParentFC: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <div className="appointment-suspense-parent">{children}</div>;
};

export const _AppointmentIdParentFC = ({ thisid }: { thisid: string }) => {
  return (
    <div key={`${thisid}-appointments-id`} className="appointment-id">
      id: {thisid}
    </div>
  );
};

export default AppointmentFC;
