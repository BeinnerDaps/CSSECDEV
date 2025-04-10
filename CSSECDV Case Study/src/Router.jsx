import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./component/SignUp";
import SignIn from "./component/SignIn";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import ChangePassword from "./component/ChangePassword";
import SecurityQuestions from "./component/SecurityQuestions";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import ProdManPage from "./pages/ProdManPage";
import CustomerPage from "./pages/CustomerPage";
import Settings from "./pages/Settings";

import { PrivateRoute, SelectRoute } from "./context/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/home", element: <Home /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <SignIn /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <SelectRoute>
        <AdminPage />
      </SelectRoute>
    ),
  },
  {
    path: "/product-manager",
    element: (
      <SelectRoute>
        <ProdManPage />
      </SelectRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <SelectRoute>
        <CustomerPage />
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
  {
    path: "/settings",
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: "/change-password",
    element: (
      <PrivateRoute>
        <ChangePassword />
      </PrivateRoute>
    ),
  },
  {
    path: "/security-questions",
    element: (
      <PrivateRoute>
        <SecurityQuestions />
      </PrivateRoute>
    ),
  },
]);
