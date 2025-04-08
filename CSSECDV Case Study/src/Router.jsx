import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./component/SignUp";
import SignIn from "./component/SignIn";
import Dashboard from "./component/Dashboard";
import AdminPage from "./pages/AdminPage";
import { PrivateRoute, AdminRoute } from "./context/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <SignIn /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />{" "}
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />{" "}
      </AdminRoute>
    ),
  },
]);
