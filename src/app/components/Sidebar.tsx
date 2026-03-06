import { NavLink } from "react-router";
import {
  LayoutGrid,
  BarChart3,
  Package,
  Settings,
  HelpCircle,
  Zap,
  Warehouse,
  Users,
  ChevronDown,
  LogOut,
  Coffee,
  Bell,
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { icon: LayoutGrid, label: "POS", path: "/" },
  { icon: Zap, label: "App Orders", path: "/orders", badge: 3 },
  { icon: BarChart3, label: "Overview", path: "/report" },
  { icon: Package, label: "Product", path: "/menu" },
  { icon: Warehouse, label: "Inventory", path: "/inventory" },
  { icon: Users, label: "Barista", path: "/barista" },
];

const bottomNav = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
];

export function Sidebar() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside className="w-[200px] shrink-0 flex flex-col bg-white border-r border-[#EBEBEB]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-9 h-9 rounded-xl bg-[#EF4123] flex items-center justify-center shadow-sm shadow-[#EF4123]/20">
          <Coffee className="w-[18px] h-[18px] text-white" />
        </div>
        <div>
          <span className="text-[15px] text-[#1A1A2E] tracking-tight">Brew Coffee</span>
          <p className="text-[10px] text-[#9CA3AF] leading-none">Point of Sale</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col px-3 mt-1">
        <p className="text-[10px] text-[#B0B0B0] uppercase tracking-widest px-3 mb-2">Menu</p>
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-[13px] relative
                ${
                  isActive
                    ? "bg-[#EF4123] text-white shadow-sm shadow-[#EF4123]/25"
                    : "text-[#6B7280] hover:bg-[#FEF3F0] hover:text-[#EF4123]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] px-1
                        ${isActive ? "bg-white/25 text-white" : "bg-[#EF4123] text-white"}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="my-4 mx-3 h-px bg-[#F0F0F0]" />

        <p className="text-[10px] text-[#B0B0B0] uppercase tracking-widest px-3 mb-2">Other</p>
        <div className="flex flex-col gap-0.5">
          {bottomNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-[13px]
                ${
                  isActive
                    ? "bg-[#EF4123] text-white shadow-sm shadow-[#EF4123]/25"
                    : "text-[#6B7280] hover:bg-[#FEF3F0] hover:text-[#EF4123]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Store Info + User */}
      <div className="px-3 pb-4 space-y-3">
        {/* Store selector */}
        <div className="mx-1 px-3 py-2 bg-[#FAFAFA] rounded-xl border border-[#F0F0F0]">
          <p className="text-[10px] text-[#B0B0B0] mb-0.5">Active Store</p>
          <p className="text-[12px] text-[#1A1A2E] truncate">Brew Coffee Sudirman</p>
        </div>

        {/* User */}
        <div className="relative mx-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[#FAFAFA] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EF4123] to-[#FF7A5C] flex items-center justify-center text-[10px] text-white shrink-0">
              LB
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[12px] text-[#1A1A2E] truncate">Leonard B.</p>
              <p className="text-[10px] text-[#9CA3AF]">Shift Manager</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl border border-[#EBEBEB] shadow-lg py-1 z-50">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#6B7280] hover:bg-[#FEF3F0] hover:text-[#EF4123]">
                <Bell className="w-3.5 h-3.5" /> Notifications
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#EF4123] hover:bg-[#FEF3F0]">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
