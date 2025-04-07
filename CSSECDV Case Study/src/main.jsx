import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./Router.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/Authcontext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <h1 className="text-3xl pt-4 font-bold text-center">CSSECDV Case Study</h1>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
