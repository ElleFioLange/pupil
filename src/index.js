import React from "react";
import ReactDOM from "react-dom/client";

import "./globals.css";

import Landing from "./pages/Landing";
import Chat from "./pages/Chat";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GlobalProvider } from "./components/util/GlobalProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/modules/1",
    element: <Chat />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
