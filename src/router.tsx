import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import Members from "@/pages/Members";
import ErrorSimulator from "@/pages/ErrorSimulator";
import Todo from "@/pages/Todo";
import OttSearch from "@/pages/OttSearch";
import DrugSearch from "@/pages/DrugSearch";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "members", element: <Members /> },
      { path: "error-simulator", element: <ErrorSimulator /> },
      { path: "todo", element: <Todo /> },
      { path: "ott-search", element: <OttSearch /> },
      { path: "drug-search", element: <DrugSearch /> },
    ],
  },
]);
