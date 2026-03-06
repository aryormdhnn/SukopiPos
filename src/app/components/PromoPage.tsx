import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, Plus, Tag, Percent, Calendar, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Promo {
    id: string;
    name: string;
    type: "Discount" | "BOGO" | "Bundle";
    value: string;
    minOrder: number;
    startDate: string;
    endDate: string;
    active: boolean;
    usageCount: number;
}

const initialPromos: Promo[] = [
    { id: "P001", name: "Happy Hour", type: "Discount", value: "20%", minOrder: 0, startDate: "2026-03-01", endDate: "2026-03-31", active: true, usageCount: 132 },
    { id: "P002", name: "Buy 2 Get 1", type: "BOGO", value: "1 Free", minOrder: 60000, startDate: "2026-03-01", endDate: "2026-03-15", active: true, usageCount: 48 },
    { id: "P003", name: "Payday Bundle", type: "Bundle", value: "Rp 5.000 off", minOrder: 100000, startDate: "2026-03-25", endDate: "2026-03-31", active: false, usageCount: 0 },
    { id: "P004", name: "Weekend Special", type: "Discount", value: "15%", minOrder: 0, startDate: "2026-03-08", endDate: "2026-03-09", active: false, usageCount: 67 },
];

const typeColors: Record<string, { bg: string; text: string }> = {
    Discount: { bg: "bg-red-50", text: "text-red-500" },
    BOGO: { bg: "bg-blue-50", text: "text-blue-600" },
    Bundle: { bg: "bg-amber-50", text: "text-amber-600" },
};

export function PromoPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [promos, setPromos] = useState<Promo[]>(initialPromos);
    const [filter, setFilter] = useState("All");

    const filtered = promos.filter((p) => {
        const matchFilter = filter === "All" || (filter === "Active" ? p.active : !p.active);
        const matchSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchFilter && matchSearch;
    });

    const toggleActive = (id: string) => {
        setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const deletePromo = (id: string) => {
        setPromos(promos.filter(p => p.id !== id));
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Promo & Diskon" subtitle="Manage promotions and discounts" searchPlaceholder="Search promo..." />

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/report")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5">
                    <ArrowLeft className="w-4 h-4" /> Back to Overview
                </button>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { label: "Active Promos", value: promos.filter(p => p.active).length, icon: Tag, color: "text-[#EF4123] bg-[#FEF3F0]" },
                        { label: "Total Usage", value: promos.reduce((s, p) => s + p.usageCount, 0), icon: Percent, color: "text-blue-500 bg-blue-50" },
                        { label: "Expired", value: promos.filter(p => !p.active).length, icon: Calendar, color: "text-amber-500 bg-amber-50" },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[12px] text-[#9CA3AF]">{stat.label}</span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-[24px] text-[#1A1A2E]">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters + Create */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-xl">
                        {["All", "Active", "Inactive"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[12px] transition-all ${filter === f ? "bg-white text-[#1A1A2E] shadow-sm" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#EF4123] text-white rounded-xl text-[12px] hover:bg-[#D93A1F] shadow-sm">
                        <Plus className="w-4 h-4" /> Create Promo
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[11px] text-[#C4C4C4] bg-[#FAFAFA] uppercase tracking-wider">
                                <th className="text-left px-4 py-3 font-medium">Promo Name</th>
                                <th className="text-left px-4 py-3 font-medium">Type</th>
                                <th className="text-left px-4 py-3 font-medium">Value</th>
                                <th className="text-left px-4 py-3 font-medium">Period</th>
                                <th className="text-left px-4 py-3 font-medium">Usage</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(promo => {
                                const tc = typeColors[promo.type] || typeColors.Discount;
                                return (
                                    <tr key={promo.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-[13px] text-[#1A1A2E]">{promo.name}</p>
                                            <p className="text-[10px] text-[#9CA3AF] font-mono">{promo.id}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${tc.bg} ${tc.text}`}>{promo.type}</span>
                                        </td>
                                        <td className="px-4 py-3 text-[13px] text-[#1A1A2E] font-medium">{promo.value}</td>
                                        <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                                            {promo.startDate} → {promo.endDate}
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-[#1A1A2E]">{promo.usageCount}x</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleActive(promo.id)} className="flex items-center gap-1.5 text-[12px]">
                                                {promo.active
                                                    ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Active</span></>
                                                    : <><ToggleLeft className="w-5 h-5 text-[#C4C4C4]" /><span className="text-[#9CA3AF]">Inactive</span></>
                                                }
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => deletePromo(promo.id)} className="text-[#EF4123] hover:bg-[#FEF3F0] p-1.5 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-[#F0F0F0]">
                        <p className="text-[11px] text-[#C4C4C4]">{filtered.length} promotions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
