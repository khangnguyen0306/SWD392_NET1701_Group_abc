import { createBrowserRouter } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import AuthGuard from "./AuthGuard";
const Login = Loadable({ loader: () => import("../pages/login/Login") });
const Register = Loadable({ loader: () => import("../pages/register/Register") });
const Home = Loadable({ loader: () => import("../pages/home/Home") });
const UserProfile = Loadable({ loader: () => import("../pages/userProfile/UserProfile") });
const ProductPage = Loadable({ loader: () => import("../pages/product/ProductPage") });
const ProductDetail = Loadable({ loader: () => import("../pages/product/ProductDetail") });
const errorPage = Loadable({ loader: () => import("../pages/error/Error") });
const Dashboard = Loadable({
  loader: () => import("../pages/dashboard/Dashboard"),
});
const Admin = Loadable({
  loader: () => import("../pages/admin/Admin"),
});
export const router = createBrowserRouter([
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/register",
    element: Register,
  },
  {
    path: "/product",
    element: ProductPage,
  },
  {
    path: "/productDetail/:productId",
    element: ProductDetail,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <AuthGuard />,
        children: [
          {
            index: true,
            element: Dashboard,
          },
          {
            path: "home",
            element: Home,
          },
          {
            path: "admin",
            element: Admin,
          },
          {
            path: "user-profile",                         //id it not defined in the path
            element: UserProfile,         
          },
        ],
      },
    ]
  },

  {
    path: "*",
    element: errorPage,
  },
]);
