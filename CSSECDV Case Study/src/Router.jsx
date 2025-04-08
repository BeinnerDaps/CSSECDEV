import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./component/SignUp";
import SignIn from "./component/SignIn";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import ProdManPage from "./pages/ProdManPage";
import CustomerPage from "./pages/CustomerPage";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import { PrivateRoute, SelectRoute } from "./context/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <SignIn /> },
  {
    path: "/dashboard",
    element: (
      <SelectRoute>
        <Dashboard />{" "}
      </SelectRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <SelectRoute>
        <AdminPage />{" "}
      </SelectRoute>
    ),
  },
  {
    path: "/product-manager",
    element: (
      <SelectRoute>
        <ProdManPage />{" "}
      </SelectRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <SelectRoute>
        <CustomerPage />{" "}
      </SelectRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);
