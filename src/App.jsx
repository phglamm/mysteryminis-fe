import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { route } from "./routes";
import UserLayout from "./layouts/UserLayout/UserLayout";

import Homepage from "./pages/UserPages/Homepage/Homepage";
import LoginPage from "./pages/UserPages/LoginPage/LoginPage";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import RegisterPage from "./pages/UserPages/RegisterPage/RegisterPage";
import ForgotPasswordPage from "./pages/UserPages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/UserPages/ResetPasswordPage/ResetPasswordPage";
import ManageAccount from "./pages/AdminPages/ManageAccount/ManageAccount";
import ManageBox from "./pages/AdminPages/ManageBox/ManageBox";
import ProductDetailPage from "./pages/UserPages/ProductDetailPage/ProductDetailPage";
import ProductPage from "./pages/UserPages/ProductPage/ProductPage";

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
        {
          path: route.productDetail,
          element: <ProductDetailPage />,
        },
        {
          path: route.product,
          element: <ProductPage/>,
        },
      ],
    },

    {
      path: route.admin,
      element: <AdminLayout />,
      children: [
        {
          path: route.accountManagement,
          element: <ManageAccount />,
        },
        {
          path: route.boxManagement,
          element: <ManageBox />,
        },
      ],
    },

    {
      path: route.staff,
      element: <AdminLayout />,
      children: [
        {
          path: route.accountManagement,
          element: <ManageAccount />,
        },
        {
          path: route.boxManagement,
          element: <ManageBox />,
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
