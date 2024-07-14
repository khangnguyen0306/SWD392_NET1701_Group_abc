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
    if (!user || user.roleId !== 1) {
      return <Navigate to="/404" replace />;
    }
  }
  if (location.pathname === "manage-products" || (location.pathname === "postmanager") || (location.pathname === "manage-categories")) {
    if (!user || user.roleId !== 3 || user.roleId !== 1) {
      return <Navigate to="/404" replace />;
    }
  }
  // return user ? <Outlet /> || { children } : <Navigate to="/404" replace />;
  return <Outlet />;
};

export default AuthGuard;
