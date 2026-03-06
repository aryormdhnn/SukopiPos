import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, Coffee, Timer, Star, TrendingUp, TrendingDown } from "lucide-react";
import { baristas } from "./pos-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const avatarColors = [
    "from-orange-400 to-red-400",
    "from-pink-400 to-rose-400",
    "from-violet-400 to-purple-400",
    "from-teal-400 to-cyan-400",
    "from-blue-400 to-indigo-400",
];

const gradeColors: Record<string, { bg: string; text: string }> = {
    A: { bg: "bg-green-50", text: "text-green-600" },
    "A-": { bg: "bg-green-50", text: "text-green-500" },
    "B+": { bg: "bg-blue-50", text: "text-blue-600" },
    B: { bg: "bg-amber-50", text: "text-amber-600" },
    "B-": { bg: "bg-amber-50", text: "text-amber-500" },
};

const initials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const chartData = baristas.map(b => ({ name: b.name.split(" ")[0], orders: b.ordersHandled }));

export function BaristaPerformancePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState("This Month");
    const [selectedBarista, setSelectedBarista] = useState(baristas[0]);

    const gc = gradeColors[selectedBarista.grade] || gradeColors.B;

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Performa Barista" subtitle="Detailed barista performance analytics" searchPlaceholder="Search barista..." />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/barista")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Barista
                </button>

                {/* Period */}
                <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-xl w-fit mb-5">
                    {["Today", "This Week", "This Month"].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-[12px] transition-all ${period === p ? "bg-white text-[#1A1A2E] shadow-sm" : "text-[#9CA3AF]"}`}>{p}</button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    {/* Barista List */}
                    <div className="space-y-2">
                        {baristas.filter(b => searchQuery ? b.name.toLowerCase().includes(searchQuery.toLowerCase()) : true).map((b, idx) => (
                            <button key={b.id} onClick={() => setSelectedBarista(b)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedBarista.id === b.id ? "border-[#EF4123] bg-[#FEF3F0]/40" : "border-[#EBEBEB] bg-white hover:border-[#EF4123]/30"}`}>
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[10px] shrink-0`}>
                                    {initials(b.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] text-[#1A1A2E] truncate">{b.name}</p>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${gradeColors[b.grade]?.bg} ${gradeColors[b.grade]?.text}`}>{b.grade}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Header Card */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[baristas.indexOf(selectedBarista) % avatarColors.length]} flex items-center justify-center text-white text-[18px] shrink-0`}>
                                {initials(selectedBarista.name)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[18px] text-[#1A1A2E]">{selectedBarista.name}</h2>
                                    {baristas.indexOf(selectedBarista) === 0 && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                                </div>
                                <p className="text-[12px] text-[#9CA3AF]">{selectedBarista.position} · {selectedBarista.employeeId}</p>
                            </div>
                            <span className={`text-[28px] px-4 py-2 rounded-xl ${gc.bg} ${gc.text}`}>{selectedBarista.grade}</span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Orders Handled", value: selectedBarista.ordersHandled, icon: Coffee, change: "+8.3%", up: true },
                                { label: "Avg. Prep Time", value: selectedBarista.avgTime, icon: Timer, change: "-0:12", up: true },
                                { label: "Customer Rating", value: "4.8 / 5.0", icon: Star, change: "+0.1", up: true },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] text-[#9CA3AF]">{stat.label}</span>
                                        <stat.icon className="w-4 h-4 text-[#C4C4C4]" />
                                    </div>
                                    <p className="text-[20px] text-[#1A1A2E] mb-1">{stat.value}</p>
                                    <div className={`flex items-center gap-0.5 text-[10px] ${stat.up ? "text-green-500" : "text-red-400"}`}>
                                        {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {stat.change} vs last period
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                            <h3 className="text-[14px] text-[#1A1A2E] mb-4">Orders Comparison This Month</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} barSize={28}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EBEBEB", fontSize: 12 }} />
                                        <Bar dataKey="orders" fill="#EF4123" radius={[6, 6, 0, 0]}
                                            opacity={0.4}
                                            className="transition-all"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
