import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, ArrowRight, Plus, TrendingDown, ArrowLeftRight } from "lucide-react";

const movements = [
    { id: "M001", item: "Fresh Milk", type: "in" as const, qty: 20, from: "PT Greenfield", date: "2026-03-05", by: "Leonard B.", notes: "Regular restock" },
    { id: "M002", item: "Arabica Blend", type: "in" as const, qty: 10, from: "PT Toffin", date: "2026-03-04", by: "Logan R.", notes: "" },
    { id: "M003", item: "Oat Milk", type: "out" as const, qty: 5, from: "Waste/Expired", date: "2026-03-04", by: "Theresia H.", notes: "Expired batch" },
    { id: "M004", item: "Caramel Syrup", type: "transfer" as const, qty: 3, from: "Brew Coffee Kuningan", date: "2026-03-03", by: "Leonard B.", notes: "Branch transfer" },
    { id: "M005", item: "Espresso Beans", type: "in" as const, qty: 15, from: "Otten Coffee", date: "2026-03-02", by: "Logan R.", notes: "" },
];

export function StockMovementPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = movements.filter(m => {
        const matchFilter = filter === "All" || (filter === "In" && m.type === "in") || (filter === "Out" && m.type === "out") || (filter === "Transfer" && m.type === "transfer");
        const matchSearch = searchQuery ? m.item.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchFilter && matchSearch;
    });

    const icons = {
        in: { icon: Plus, bg: "bg-green-50", text: "text-green-500", label: "Received" },
        out: { icon: TrendingDown, bg: "bg-red-50", text: "text-[#EF4123]", label: "Removed" },
        transfer: { icon: ArrowLeftRight, bg: "bg-blue-50", text: "text-blue-500", label: "Transfer" },
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Pergerakan Stok" subtitle="Track all stock movements" searchPlaceholder="Search item..." />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/inventory")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Inventory
                </button>

                {/* Action Cards */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <button onClick={() => navigate("/inventory/movement/receive")} className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex items-center gap-4 hover:border-[#EF4123] hover:shadow-sm transition-all text-left group">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[14px] text-[#1A1A2E] group-hover:text-[#EF4123] transition-colors">Terima Stok Baru</p>
                            <p className="text-[11px] text-[#9CA3AF]">Record received goods</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C4C4C4] ml-auto group-hover:text-[#EF4123] transition-colors" />
                    </button>
                    <button onClick={() => navigate("/inventory/movement/transfer")} className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex items-center gap-4 hover:border-[#EF4123] hover:shadow-sm transition-all text-left group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <ArrowLeftRight className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[14px] text-[#1A1A2E] group-hover:text-[#EF4123] transition-colors">Transfer Stok</p>
                            <p className="text-[11px] text-[#9CA3AF]">Transfer between branches</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C4C4C4] ml-auto group-hover:text-[#EF4123] transition-colors" />
                    </button>
                </div>

                {/* Filter */}
                <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-xl w-fit mb-4">
                    {["All", "In", "Out", "Transfer"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[12px] transition-all ${filter === f ? "bg-white text-[#1A1A2E] shadow-sm" : "text-[#9CA3AF]"}`}>{f}</button>
                    ))}
                </div>

                {/* Movement List */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[11px] text-[#C4C4C4] bg-[#FAFAFA] uppercase tracking-wider">
                                <th className="text-left px-4 py-3 font-medium">Type</th>
                                <th className="text-left px-4 py-3 font-medium">Item</th>
                                <th className="text-left px-4 py-3 font-medium">Qty</th>
                                <th className="text-left px-4 py-3 font-medium">Source / Destination</th>
                                <th className="text-left px-4 py-3 font-medium">Date</th>
                                <th className="text-left px-4 py-3 font-medium">By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(m => {
                                const cfg = icons[m.type];
                                const Icon = cfg.icon;
                                return (
                                    <tr key={m.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                                                <Icon className={`w-4 h-4 ${cfg.text}`} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[13px] text-[#1A1A2E]">{m.item}</p>
                                            {m.notes && <p className="text-[10px] text-[#9CA3AF] italic">{m.notes}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[13px] font-medium ${m.type === "in" ? "text-green-600" : m.type === "out" ? "text-[#EF4123]" : "text-blue-600"}`}>
                                                {m.type === "in" ? "+" : m.type === "out" ? "-" : "↔"}{m.qty}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-[#6B7280]">{m.from}</td>
                                        <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{m.date}</td>
                                        <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{m.by}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-[#F0F0F0]">
                        <p className="text-[11px] text-[#C4C4C4]">{filtered.length} movements</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
