import { useState } from "react";
import { TopBar } from "./TopBar";
import { baristas } from "./pos-data";
import { ArrowRight, Calendar, Clock, Award, Coffee, Timer, ChevronDown, Users, Star } from "lucide-react";

const avatarColors = [
  "from-orange-400 to-red-400",
  "from-pink-400 to-rose-400",
  "from-violet-400 to-purple-400",
  "from-teal-400 to-cyan-400",
  "from-blue-400 to-indigo-400",
];

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const gradeColors: Record<string, { bg: string; text: string }> = {
  A: { bg: "bg-green-50", text: "text-green-600" },
  "A-": { bg: "bg-green-50", text: "text-green-500" },
  "B+": { bg: "bg-blue-50", text: "text-blue-600" },
  B: { bg: "bg-amber-50", text: "text-amber-600" },
  "B-": { bg: "bg-amber-50", text: "text-amber-500" },
  C: { bg: "bg-red-50", text: "text-red-500" },
};

const statusBadge: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-green-50", text: "text-green-600" },
  "On Leave": { bg: "bg-amber-50", text: "text-amber-600" },
};

export function BaristaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("March 2026");

  const activeBaristas = baristas.filter((b) => b.status === "Active").length;
  const totalOrders = baristas.reduce((s, b) => s + b.ordersHandled, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Barista" subtitle="Schedule and performance management" searchPlaceholder="Search barista..." />
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#9CA3AF]">On Duty Today</span>
              <Users className="w-4 h-4 text-[#C4C4C4]" />
            </div>
            <p className="text-[22px] text-[#1A1A2E]">{activeBaristas}<span className="text-[14px] text-[#C4C4C4]">/{baristas.length}</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#9CA3AF]">Orders Handled</span>
              <Coffee className="w-4 h-4 text-[#C4C4C4]" />
            </div>
            <p className="text-[22px] text-[#1A1A2E]">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#9CA3AF]">Top Performer</span>
              <Award className="w-4 h-4 text-[#EF4123]" />
            </div>
            <p className="text-[14px] text-[#1A1A2E]">{baristas[0].name}</p>
            <p className="text-[10px] text-[#C4C4C4]">{baristas[0].ordersHandled} orders · {baristas[0].avgTime} avg</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Schedule Table */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] text-[#1A1A2E]">Today's Schedule</h2>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] text-[12px] text-[#6B7280]">
                <Calendar className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#F0F0F0]">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">
                    <th className="text-left px-4 py-2.5">Barista</th>
                    <th className="text-left px-4 py-2.5">Employee ID</th>
                    <th className="text-left px-4 py-2.5">Shift</th>
                    <th className="text-left px-4 py-2.5">Position</th>
                    <th className="text-left px-4 py-2.5">Clock-In</th>
                    <th className="text-left px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {baristas.map((b, idx) => {
                    const sBadge = statusBadge[b.status] || statusBadge.Active;
                    return (
                      <tr key={b.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[10px] shrink-0`}>
                              {initials(b.name)}
                            </div>
                            <span className="text-[12px] text-[#1A1A2E] truncate">{b.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#9CA3AF] font-mono">{b.employeeId}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                          {b.shift === "-" ? <span className="text-[#C4C4C4]">-</span> : b.shift}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{b.position}</td>
                        <td className="px-4 py-3">
                          {b.clockIn === "-" ? (
                            <span className="text-[12px] text-[#C4C4C4]">-</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEF3F0] text-[#EF4123] rounded-md text-[11px]">
                              <Clock className="w-3 h-3" />{b.clockIn}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${sBadge.bg} ${sBadge.text}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 rounded-xl bg-[#EF4123] text-white text-[13px] hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25">
                Assign Shift
              </button>
              <button className="flex-1 py-3 rounded-xl border border-[#EBEBEB] text-[#6B7280] text-[13px] hover:bg-[#FAFAFA]">
                Edit Schedule
              </button>
            </div>
          </div>

          {/* Performance Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] text-[#1A1A2E]">Performance</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] focus:outline-none"
              >
                <option>March 2026</option><option>February 2026</option><option>January 2026</option>
              </select>
            </div>

            <div className="space-y-3">
              {baristas.map((b, idx) => {
                const gc = gradeColors[b.grade] || gradeColors.B;
                return (
                  <div key={b.id} className={`p-3.5 rounded-xl border transition-all ${idx === 0 ? "border-[#EF4123] bg-[#FEF3F0]/40" : "border-[#F0F0F0] hover:border-[#EF4123]/30"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[11px] shrink-0`}>
                        {initials(b.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] text-[#1A1A2E] truncate">{b.name}</p>
                          {idx === 0 && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-[10px] text-[#C4C4C4]">{b.position}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[14px] ${gc.bg} ${gc.text}`}>
                        {b.grade}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F5F5F5]">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Coffee className="w-3 h-3 text-[#C4C4C4]" />
                        <span className="text-[#9CA3AF]">Orders:</span>
                        <span className="text-[#1A1A2E]">{b.ordersHandled}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Timer className="w-3 h-3 text-[#C4C4C4]" />
                        <span className="text-[#9CA3AF]">Avg:</span>
                        <span className="text-[#1A1A2E]">{b.avgTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end mt-4">
              <button className="flex items-center gap-1 text-[12px] text-[#EF4123] hover:underline">
                Full Report <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
