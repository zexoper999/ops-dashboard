import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import Members from "@/pages/Members";
import ErrorSimulator from "@/pages/ErrorSimulator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "members", element: <Members /> },
      { path: "error-simulator", element: <ErrorSimulator /> },
    ],
  },
]);
