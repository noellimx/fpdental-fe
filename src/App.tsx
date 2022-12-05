import "./App.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";

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
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
