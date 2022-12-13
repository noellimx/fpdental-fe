import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import useAuthService from "./contexts/Auth";
import { GlobalContextAuth } from "./contexts/Auth";

import GeneralUser from "./components/GeneralUser";
import AdminUser from "./components/AdminUser";
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

      {
        path: "/admin-user",
        element: <AdminUser />,
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
        <RouterProvider router={router} />
      </GlobalContextAuth.Provider>
    </div>
  );
}

export default App;
