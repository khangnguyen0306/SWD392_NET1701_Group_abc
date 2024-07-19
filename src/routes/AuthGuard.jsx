import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentToken, selectCurrentUser } from "../slices/auth.slice";


const AuthGuard = ({ allowedRoles, children }) => {

  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  console.log(user)        
  const location = useLocation();

  if (token && (location.pathname === "/login")) return <Navigate to='/' />
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
 
  if (location.pathname === "/dashboard") {
    if (!token || user?.roleId !== 1) {
      return <Navigate to="/404" replace />;
    }
  }
  const allowedManagerRoutes = ["/manage-products", "/postmanager", "/manage-categories","/manage-appeal"];
  if (allowedManagerRoutes.includes(location.pathname)) {
    if (![1, 3].includes(user?.roleId)) {
      return <Navigate to="/404" replace />;
    }
  }
  return <Outlet />;
};

export default AuthGuard;
