import { useState } from "react";
import { TopBar } from "./TopBar";
import {
  Bell, Globe, Printer, Shield, Store, CreditCard, Users, ChevronRight,
  Moon, Volume2, Wifi, HardDrive, RefreshCw, FileText, Phone, Mail,
} from "lucide-react";

const settingsSections = [
  {
    title: "Store",
    items: [
      { icon: Store, label: "Store Information", description: "Name, address, operating hours", detail: "Brew Coffee Sudirman" },
      { icon: Globe, label: "Language & Region", description: "Language, currency, timezone", detail: "ID · IDR · WIB" },
      { icon: Printer, label: "Receipt & Printing", description: "Receipt template, printer settings", detail: "Epson TM-T82X" },
    ],
  },
  {
    title: "Business",
    items: [
      { icon: CreditCard, label: "Payment Methods", description: "Manage accepted payment options", detail: "8 methods" },
      { icon: Users, label: "Staff & Permissions", description: "Roles, access levels, PIN codes", detail: "5 staff" },
      { icon: Shield, label: "Security", description: "Password, PIN, session timeout", detail: "PIN enabled" },
      { icon: FileText, label: "Tax & Service Charge", description: "PPN, service charge settings", detail: "PPN 11%" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Bell, label: "Notifications", description: "Order, stock, shift alert preferences", detail: "All enabled" },
      { icon: Wifi, label: "Network & Sync", description: "Offline mode, data sync settings", detail: "Online" },
      { icon: HardDrive, label: "Backup & Restore", description: "Data backup schedule", detail: "Daily 2AM" },
    ],
  },
];

const toggleSettings = [
  { label: "Dark Mode", description: "Switch to dark theme", icon: Moon, enabled: false },
  { label: "Sound Alerts", description: "Play sound on new orders", icon: Volume2, enabled: true },
  { label: "Auto Sync", description: "Sync data every 5 minutes", icon: RefreshCw, enabled: true },
];

export function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(toggleSettings.map((t) => [t.label, t.enabled]))
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Settings" subtitle="Configure your POS system" searchPlaceholder="Search settings..." />
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-2xl space-y-6">
          {/* Store Profile Card */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EF4123] flex items-center justify-center shadow-sm shadow-[#EF4123]/20">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] text-[#1A1A2E]">Brew Coffee Sudirman</h2>
                <p className="text-[12px] text-[#9CA3AF]">Jl. Jend. Sudirman No.52, Senayan, Jakarta Selatan</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]"><Phone className="w-3 h-3" /> (021) 555-0123</span>
                  <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]"><Mail className="w-3 h-3" /> sudirman@brewcoffee.id</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg shrink-0">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-green-600">Open</span>
              </div>
            </div>
          </div>

          {/* Setting Sections */}
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] text-[#C4C4C4] uppercase tracking-widest mb-2 px-1">{section.title}</h3>
              <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                {section.items.map((item, idx) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FAFAFA] transition-colors ${idx > 0 ? "border-t border-[#F5F5F5]" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3F0] flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#EF4123]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#1A1A2E]">{item.label}</p>
                      <p className="text-[11px] text-[#C4C4C4]">{item.description}</p>
                    </div>
                    <span className="text-[11px] text-[#9CA3AF] shrink-0 mr-2">{item.detail}</span>
                    <ChevronRight className="w-4 h-4 text-[#D4D4D4] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Toggle Settings */}
          <div>
            <h3 className="text-[11px] text-[#C4C4C4] uppercase tracking-widest mb-2 px-1">Preferences</h3>
            <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
              {toggleSettings.map((ts, idx) => (
                <div
                  key={ts.label}
                  className={`flex items-center gap-4 px-5 py-4 ${idx > 0 ? "border-t border-[#F5F5F5]" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] flex items-center justify-center shrink-0">
                    <ts.icon className="w-5 h-5 text-[#6B7280]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-[#1A1A2E]">{ts.label}</p>
                    <p className="text-[11px] text-[#C4C4C4]">{ts.description}</p>
                  </div>
                  <button
                    onClick={() => setToggleStates((prev) => ({ ...prev, [ts.label]: !prev[ts.label] }))}
                    className={`relative w-11 h-6 rounded-full transition-all ${toggleStates[ts.label] ? "bg-[#EF4123]" : "bg-[#D4D4D4]"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${toggleStates[ts.label] ? "left-[24px]" : "left-[4px]"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="text-center py-4 space-y-1">
            <p className="text-[12px] text-[#C4C4C4]">Brew Coffee POS v2.4.1</p>
            <p className="text-[10px] text-[#D4D4D4]">Licensed to PT Brew Indonesia · Expires Dec 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
