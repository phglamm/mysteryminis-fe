import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { route } from "./routes";
import UserLayout from "./layouts/UserLayout/UserLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Homepage from "./pages/UserPages/Homepage";
import LoginPage from "./pages/UserPages/LoginPage";
import ManageUser from "./pages/AdminPages/ManageUser";
import ManageRole from "./pages/AdminPages/ManageRole";

function App() {
  const router = createBrowserRouter([
    {
      path: route.home,
      element: <UserLayout />,
      children: [
        {
          path: route.home,
          element: <Homepage />,
        },
        {
          path: route.login,
          element: <LoginPage />,
        },
      ],
    },

    {
      path: route.admin,
      element: (
        <ProtectedRoute roles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: route.userManagement,
          element: (
            <ProtectedRoute roles={["admin"]}>
              <ManageUser />
            </ProtectedRoute>
          ),
        },
        {
          path: route.roleManagement,
          element: (
            <ProtectedRoute roles={["admin"]}>
              <ManageRole />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
