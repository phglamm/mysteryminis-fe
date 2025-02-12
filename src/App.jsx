import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { route } from "./routes";
import UserLayout from "./layouts/UserLayout/UserLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import Homepage from "./pages/UserPages/Homepage/Homepage";
import LoginPage from "./pages/UserPages/LoginPage/LoginPage";
import ManageUser from "./pages/AdminPages/ManageUser/ManageUser";
import ManageRole from "./pages/AdminPages/ManageRole/ManageRole";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import RegisterPage from "./pages/UserPages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "./pages/UserPages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/UserPages/ResetPasswordPage/ResetPasswordPage";

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
        {
          path: route.register,
          element: <RegisterPage />,
        },
        {
          path: route.forgotPassword,
          element: <ForgotPasswordPage />,
        },
        {
          path: route.resetPassword,
          element: <ResetPasswordPage />,
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
