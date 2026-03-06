import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
}

export function TopBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search product...",
  title,
  subtitle,
}: TopBarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const notifications = [
    { id: 1, text: "New order #ORD-20260305-008 received", time: "Just now", unread: true },
    { id: 2, text: "Fresh Milk stock below minimum (4 remaining)", time: "12 min ago", unread: true },
    { id: 3, text: "Theresia clock-in recorded at 6:42 AM", time: "3 hrs ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="flex items-center justify-between px-6 py-4 shrink-0">
      {/* Left */}
      <div>
        <h1 className="text-[18px] text-[#1A1A2E] leading-tight">
          {title || `${greeting}, Leonard`}
        </h1>
        <p className="text-[12px] text-[#9CA3AF]">{subtitle || dateStr}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-56 bg-white border border-[#EBEBEB] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/15 focus:border-[#EF4123]/40 transition-all"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-10 h-10 rounded-xl border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FAFAFA] transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-[#6B7280]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#EF4123] rounded-full flex items-center justify-center text-[9px] text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#EBEBEB] shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F0F0F0] flex items-center justify-between">
                  <span className="text-[14px] text-[#1A1A2E]">Notifications</span>
                  <span className="text-[11px] text-[#EF4123] cursor-pointer hover:underline">Mark all read</span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-[#F8F8F8] last:border-none hover:bg-[#FAFAFA] transition-colors cursor-pointer ${
                      n.unread ? "bg-[#FEF3F0]/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {n.unread && <span className="w-2 h-2 rounded-full bg-[#EF4123] mt-1.5 shrink-0" />}
                      <div className={n.unread ? "" : "pl-4"}>
                        <p className="text-[12px] text-[#1A1A2E]">{n.text}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 bg-[#FAFAFA]">
                  <button className="w-full text-center text-[12px] text-[#EF4123] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Today */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-[#FAFAFA] rounded-xl border border-[#F0F0F0]">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-[#6B7280]">Store Open</span>
        </div>
      </div>
    </header>
  );
}
