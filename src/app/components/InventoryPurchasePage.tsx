import { useState } from "react";
import { TopBar } from "./TopBar";
import { ArrowLeft, Plus, Download, Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router";

// Mock data for purchases
const purchaseHistory = [
    { id: "POP-1002", supplier: "PT Greenfield Indonesia", items: 2, totalRupiah: 450000, date: "2026-03-05", status: "Completed", by: "Leonard B." },
    { id: "POP-1001", supplier: "PT Toffin Indonesia", items: 5, totalRupiah: 1250000, date: "2026-03-04", status: "Completed", by: "Logan R." },
    { id: "POP-1000", supplier: "PT Monin Indonesia", items: 3, totalRupiah: 850000, date: "2026-03-03", status: "Completed", by: "Leonard B." },
];

export function InventoryPurchasePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredPurchases = purchaseHistory.filter((p) => {
        const matchStatus = statusFilter === "All" || p.status === statusFilter;
        const matchSearch = searchQuery ? p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchStatus && matchSearch;
    });

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                title="Pembelian Bahan Baku"
                subtitle="Manage raw material purchases"
                searchPlaceholder="Search PO or supplier..."
            />

            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="flex items-center gap-3 mb-5">
                    <button
                        onClick={() => navigate("/inventory")}
                        className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Inventory
                    </button>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
                            <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Status</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]"
                            >
                                <option>All</option>
                                <option>Completed</option>
                                <option>Pending</option>
                                <option>Draft</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#EBEBEB] bg-white text-[#6B7280] rounded-xl text-[12px] hover:bg-[#F5F5F5] transition-colors">
                            <Download className="w-3.5 h-3.5" /> Export PDF
                        </button>
                        <button
                            onClick={() => navigate("/inventory/purchase/create")}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#EF4123] text-white rounded-xl text-[12px] hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25"
                        >
                            <Plus className="w-4 h-4" /> Create PO
                        </button>
                    </div>
                </div>

                {/* Purchase History Table */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] text-[#C4C4C4] bg-[#FAFAFA] uppercase tracking-wider">
                                <th className="px-4 py-3 font-medium">PO Number</th>
                                <th className="px-4 py-3 font-medium">Supplier</th>
                                <th className="px-4 py-3 font-medium">Items</th>
                                <th className="px-4 py-3 font-medium">Total Amount</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Created By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPurchases.length > 0 ? (
                                filteredPurchases.map((purchase) => (
                                    <tr key={purchase.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors cursor-pointer">
                                        <td className="px-4 py-3 text-[12px] text-[#1A1A2E] font-medium">{purchase.id}</td>
                                        <td className="px-4 py-3 text-[12px] text-[#1A1A2E]">{purchase.supplier}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                                                <Package className="w-3 h-3" />
                                                {purchase.items} items
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-[#1A1A2E]">
                                            Rp {purchase.totalRupiah.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                                                <Calendar className="w-3 h-3" />
                                                {purchase.date}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium
                        ${purchase.status === "Completed" ? "bg-green-50 text-green-600" : ""}
                        ${purchase.status === "Pending" ? "bg-amber-50 text-amber-600" : ""}
                        ${purchase.status === "Draft" ? "bg-gray-100 text-gray-600" : ""}
                      `}>
                                                {purchase.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{purchase.by}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-[#9CA3AF] text-[13px]">
                                        No purchase history found for "{searchQuery}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]">
                        <p className="text-[11px] text-[#C4C4C4]">Showing {filteredPurchases.length} records</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
