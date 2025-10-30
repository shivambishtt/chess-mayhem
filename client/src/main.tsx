import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./screens/Landing.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  // {
  //   path: "/game",
  //   element: <Game />,
  // },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>
);
