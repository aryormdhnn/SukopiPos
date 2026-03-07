import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { OrdersPage } from "./components/OrdersPage";
import { InventoryPage } from "./components/InventoryPage";
import { InventoryPurchasePage } from "./components/InventoryPurchasePage";
import { AddInventoryItemPage } from "./components/AddInventoryItemPage";
import { CreatePOPage } from "./components/CreatePOPage";
import { StockMovementPage } from "./components/StockMovementPage";
import { TransferStokPage } from "./components/TransferStokPage";
import { TerimaStokPage } from "./components/TerimaStokPage";
import { ReportPage } from "./components/ReportPage";
import { DetailedReportsPage } from "./components/DetailedReportsPage";
import { PromoPage } from "./components/PromoPage";
import { CreatePromoPage } from "./components/CreatePromoPage";
import { TopProductsPage } from "./components/TopProductsPage";
import { ManageMenuPage } from "./components/ManageMenuPage";
import { AddProductPage } from "./components/AddProductPage";
import { EditProductPage } from "./components/EditProductPage";
import { BaristaPage } from "./components/BaristaPage";
import { BaristaShiftPage } from "./components/BaristaShiftPage";
import { BaristaPinPage } from "./components/BaristaPinPage";
import { BaristaPerformancePage } from "./components/BaristaPerformancePage";
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
        { path: "inventory/add", Component: AddInventoryItemPage },
        { path: "inventory/purchase", Component: InventoryPurchasePage },
        { path: "inventory/purchase/create", Component: CreatePOPage },
        { path: "inventory/movement", Component: StockMovementPage },
        { path: "inventory/movement/transfer", Component: TransferStokPage },
        { path: "inventory/movement/receive", Component: TerimaStokPage },
        { path: "report", Component: ReportPage },
        { path: "report/detailed", Component: DetailedReportsPage },
        { path: "report/promo", Component: PromoPage },
        { path: "report/promo/create", Component: CreatePromoPage },
        { path: "report/top-products", Component: TopProductsPage },
        { path: "menu", Component: ManageMenuPage },
        { path: "menu/add", Component: AddProductPage },
        { path: "menu/edit", Component: EditProductPage },
        { path: "barista", Component: BaristaPage },
        { path: "barista/shift", Component: BaristaShiftPage },
        { path: "barista/pin", Component: BaristaPinPage },
        { path: "barista/performance", Component: BaristaPerformancePage },
        { path: "settings", Component: SettingsPage },
        { path: "help", Component: SettingsPage },
        { path: "*", Component: HomePage },
      ],
    },
  ]);
}

