import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";

import './App.scss'
import { useDispatch } from "react-redux";
import { loadCartFromLocalStorage } from "./slices/product.slice";
import { useEffect } from "react";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCartFromLocalStorage());
  }, [dispatch]);
  
  return (
    <RouterProvider router={router} />
  )
}

export default App
