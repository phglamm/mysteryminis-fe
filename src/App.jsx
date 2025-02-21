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
import ManageBoxImage from "./pages/AdminPages/ManageBoxImage/ManageBoxImage";
import ManageBoxItem from "./pages/AdminPages/ManageBoxItem/ManageBoxItem";
import ManageBoxOption from "./pages/AdminPages/ManageBoxOption/ManageBoxOption";
import UserProfile from "./pages/UserPages/UserProfile/UserProfile";
import ManageBrand from "./pages/AdminPages/ManageBrand/ManageBrand";
import ProductPage from "./pages/UserPages/ProductPage/ProductPage";
import ManageOrder from "./pages/AdminPages/ManageOrder/ManageOrder";
import BoxItemPage from "./pages/UserPages/BoxItemPage/BoxItemPage";
import BoxItemDetailPage from "./pages/UserPages/BoxItemDetailPage/BoxItemDetailPage";
import Cart from "./pages/UserPages/CartPage/Cart";
import CheckOutPage from "./pages/UserPages/CheckOutPage/CheckOutPage";

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
          path: route.userProfile,
          element: <UserProfile />,
        },
        {
          path: route.product,
          element: <ProductPage />,
        },
        {
          path: `${route.productDetail}/:id`,
          element: <ProductDetailPage />,
        },
        {
          path: route.boxItemPage,
          element: <BoxItemPage />,
        },

        {
          path: `${route.boxItemDetail}/:boxItemId`,
          element: <BoxItemDetailPage />,
        },
        {
          path: route.cart,
          element: <Cart />,
        },
        {
          path: route.checkout,
          element: <CheckOutPage />,
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
        {
          path: route.boxImageManagement,
          element: <ManageBoxImage />,
        },
        {
          path: route.boxItemManagement,
          element: <ManageBoxItem />,
        },
        {
          path: route.boxOptionManagement,
          element: <ManageBoxOption />,
        },
        {
          path: route.brandManagement,
          element: <ManageBrand />,
        },
        {
          path: route.orderManagement,
          element: <ManageOrder />,
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
        {
          path: route.boxImageManagement,
          element: <ManageBoxImage />,
        },
        {
          path: route.boxItemManagement,
          element: <ManageBoxItem />,
        },
        {
          path: route.boxOptionManagement,
          element: <ManageBoxOption />,
        },
        {
          path: route.orderManagement,
          element: <ManageOrder />,
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
