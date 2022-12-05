import "./App.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import useAuthService from "./contexts/auth";
import { GlobalContextAuth } from "./contexts/auth";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
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
        <RouterProvider router={router} />
      </GlobalContextAuth.Provider>
    </div>
  );
}

export default App;
