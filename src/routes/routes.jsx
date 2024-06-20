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
const ForgotPassword = Loadable({ loader: () => import("../pages/login/ForgotPassword") });
const ExchangePage = Loadable({ loader: () => import("../pages/exchange/ExchangePage") });
const PostDetail = Loadable({ loader: () => import("../pages/exchange/PostDetail") });
const AboutUs = Loadable({ loader: () => import("../pages/About/AboutUs") });
const dashboardAdmin = Loadable({ loader: () => import("../pages/dashboard/jsx/DashboardManagement") });
const errorPage = Loadable({ loader: () => import("../pages/error/Error") });
const Postmanager = Loadable({ loader: () => import("../pages/Postmanager/PostManagement") });
const Dashboard = Loadable({
  loader: () => import("../pages/dashboard/jsx/Dashboard"),
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
    path:"postmanager",
    element:Postmanager
  },
  {
    path: "/register",
    element: Register,
  },
  {
    path: "exchange",
    element: ExchangePage,
  },
  {
    index: true,
    element: Dashboard,
  },
  {
    path: "/product",
    element: ProductPage,
  },
  {
    path: "/forgot-password",
    element: ForgotPassword,
  },
  {
    path: "/about",
    element: AboutUs,
  },

  {
    path: "/productDetail/:productId",
    element: ProductDetail,
  },

  {
    path: "/postDetail/:postId",
    element: PostDetail,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <AuthGuard />,
        children: [

          {
            path: "home",
            element: Home,
          },
          {
            path: "admin",
            element: Admin,
          },
          {
            path: "user-profile",
            element: UserProfile,
          },
          {
            path:"dashboard",
            element:dashboardAdmin
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
