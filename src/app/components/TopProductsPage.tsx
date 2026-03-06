import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, TrendingUp, Star, Crown } from "lucide-react";
import { formatRupiah } from "./pos-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const topProducts = [
    { rank: 1, name: "Caffe Latte", category: "Coffee", qty: 847, revenue: 27104000, growth: 12.5 },
    { rank: 2, name: "Cold Brew", category: "Coffee", qty: 723, revenue: 21690000, growth: 8.3 },
    { rank: 3, name: "Cappuccino", category: "Coffee", qty: 654, revenue: 19620000, growth: 5.1 },
    { rank: 4, name: "Matcha Latte", category: "Non Coffee", qty: 512, revenue: 17920000, growth: 22.4 },
    { rank: 5, name: "Caramel Macchiato", category: "Coffee", qty: 489, revenue: 18582000, growth: 3.7 },
    { rank: 6, name: "Americano", category: "Coffee", qty: 478, revenue: 12428000, growth: -2.1 },
    { rank: 7, name: "Teh Tarik", category: "Tea", qty: 376, revenue: 9400000, growth: 15.3 },
    { rank: 8, name: "Croissant", category: "Pastries", qty: 312, revenue: 10920000, growth: 9.8 },
    { rank: 9, name: "Avocado Shake", category: "Non Coffee", qty: 298, revenue: 11920000, growth: 6.2 },
    { rank: 10, name: "Mango Smoothie", category: "Non Coffee", qty: 245, revenue: 8575000, growth: 11.0 },
];

const chartData = topProducts.slice(0, 7).map(p => ({ name: p.name.split(" ")[0], qty: p.qty }));

export function TopProductsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState("This Month");

    const filtered = topProducts.filter(p =>
        searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Produk Terlaris" subtitle="Ranking and performance of best-selling products" searchPlaceholder="Search product..." />

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/report")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5">
                    <ArrowLeft className="w-4 h-4" /> Back to Overview
                </button>

                {/* Period Filter */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-xl">
                        {["Today", "This Week", "This Month"].map(p => (
                            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-[12px] transition-all ${period === p ? "bg-white text-[#1A1A2E] shadow-sm" : "text-[#9CA3AF]"}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top 3 podium */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {topProducts.slice(0, 3).map((product, idx) => (
                        <div key={product.name} className={`bg-white rounded-2xl border p-5 ${idx === 0 ? "border-amber-300 bg-amber-50/30" : "border-[#EBEBEB]"}`}>
                            <div className="flex items-start justify-between mb-3">
                                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[14px] font-bold ${idx === 0 ? "bg-amber-100 text-amber-600" : "bg-[#F5F5F5] text-[#9CA3AF]"}`}>
                                    {idx === 0 ? <Crown className="w-4 h-4" /> : `#${product.rank}`}
                                </span>
                                <span className={`flex items-center gap-0.5 text-[11px] ${product.growth > 0 ? "text-green-500" : "text-red-400"}`}>
                                    <TrendingUp className="w-3 h-3" /> {product.growth > 0 ? "+" : ""}{product.growth}%
                                </span>
                            </div>
                            <p className="text-[14px] text-[#1A1A2E] mb-0.5">{product.name}</p>
                            <p className="text-[11px] text-[#9CA3AF] mb-3">{product.category}</p>
                            <p className="text-[20px] text-[#1A1A2E]">{product.qty}<span className="text-[12px] text-[#9CA3AF] ml-1">pcs</span></p>
                            <p className="text-[11px] text-[#EF4123] mt-1">{formatRupiah(product.revenue)}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Chart */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                        <h2 className="text-[16px] text-[#1A1A2E] mb-4">Sales Volume</h2>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={28}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EBEBEB", fontSize: 12 }} />
                                    <Bar dataKey="qty" fill="#EF4123" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Full Ranking */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                        <h2 className="text-[16px] text-[#1A1A2E] mb-4">Full Ranking</h2>
                        <div className="space-y-2">
                            {filtered.map(p => (
                                <div key={p.name} className="flex items-center gap-3">
                                    <span className="w-6 text-[12px] text-[#C4C4C4] text-center shrink-0">
                                        {p.rank === 1 ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" /> : `#${p.rank}`}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] text-[#1A1A2E] truncate">{p.name}</p>
                                        <p className="text-[10px] text-[#9CA3AF]">{p.category}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[12px] text-[#1A1A2E]">{p.qty} pcs</p>
                                        <p className="text-[10px] text-[#EF4123]">{formatRupiah(p.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
