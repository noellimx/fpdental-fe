import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import useAuthService from "./contexts/Auth";
import { GlobalContextAuth } from "./contexts/Auth";
import useGeneralUserAppointmentService, {
  GlobalContextUserAppointment as GlobalContextUserGeneralAppointment,
} from "./contexts/UserAppointments";

import GeneralUser from "./components/GeneralUser";
import Template from "./components/Template";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    errorElement: <div />,
    children: [
      {
        path: "/general-user",
        element: <GeneralUser />,
      },
    ],
  },
  {
    path: "contacts/:contactId",
    element: <div />,
  },
]);

function App() {
  const authCtx = useAuthService();
  return (
    <div className="app">
      <GlobalContextAuth.Provider value={authCtx}>
        <GlobalContextUserGeneralAppointment.Provider
          value={useGeneralUserAppointmentService(authCtx)}
        >
          <RouterProvider router={router} />
        </GlobalContextUserGeneralAppointment.Provider>
      </GlobalContextAuth.Provider>
    </div>
  );
}

export default App;
