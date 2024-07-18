import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";

import './App.scss'
import { useDispatch } from "react-redux";
import { loadCartFromLocalStorage } from "./slices/product.slice";
import { useEffect } from "react";
import signalRService from "./services/chatAPI";
import { setToken, setUser } from "./slices/auth.slice";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch(setToken(token));
      dispatch(setUser(JSON.parse(user)));
      signalRService.start();
    } else {
      signalRService.start();
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadCartFromLocalStorage());
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
