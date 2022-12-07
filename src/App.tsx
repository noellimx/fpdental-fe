import "./App.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import IdentityPane from "./components/IdentityPane";
import useAuthService from "./contexts/Auth";
import { GlobalContextAuth } from "./contexts/Auth";
import useGeneralUserAppointmentService, {
  GlobalContextUserAppointment as GlobalContextUserGeneralAppointment,
} from "./contexts/UserAppointments";
const router = createBrowserRouter([
  {
    path: "/",
    element: <IdentityPane />,
    errorElement: <div />,
  },
  {
    path: "contacts/:contactId",
    element: <div />,
  },
]);

function App() {
  return (
    <div className="app">
      <GlobalContextAuth.Provider value={useAuthService()}>
        <GlobalContextUserGeneralAppointment.Provider
          value={useGeneralUserAppointmentService()}
        >
          <RouterProvider router={router} />
        </GlobalContextUserGeneralAppointment.Provider>
      </GlobalContextAuth.Provider>
    </div>
  );
}

export default App;
