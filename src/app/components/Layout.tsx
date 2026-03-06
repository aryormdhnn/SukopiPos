import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="size-full flex overflow-hidden bg-[#F5F5F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}