import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { OrdersPage } from "./components/OrdersPage";
import { InventoryPage } from "./components/InventoryPage";
import { ReportPage } from "./components/ReportPage";
import { DetailedReportsPage } from "./components/DetailedReportsPage";
import { ManageMenuPage } from "./components/ManageMenuPage";
import { AddProductPage } from "./components/AddProductPage";
import { BaristaPage } from "./components/BaristaPage";
import { SettingsPage } from "./components/SettingsPage";

export function createRouter() {
  return createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: HomePage },
        { path: "orders", Component: OrdersPage },
        { path: "inventory", Component: InventoryPage },
        { path: "report", Component: ReportPage },
        { path: "report/detailed", Component: DetailedReportsPage },
        { path: "menu", Component: ManageMenuPage },
        { path: "menu/add", Component: AddProductPage },
        { path: "barista", Component: BaristaPage },
        { path: "settings", Component: SettingsPage },
        { path: "help", Component: SettingsPage },
        { path: "*", Component: HomePage },
      ],
    },
  ]);
}