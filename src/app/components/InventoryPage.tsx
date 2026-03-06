import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { inventoryItems, type InventoryItem } from "./pos-data";
import { ArrowLeft, ArrowRight, Clock, Plus, X, MoreVertical, AlertTriangle, Package, TrendingDown } from "lucide-react";

const stockMovements = [
  { id: "1", item: "Fresh Milk", qty: 20, type: "in" as const, supplier: "PT Greenfield Indonesia", date: "2026-03-05", by: "Leonard B." },
  { id: "2", item: "Brew Blend Beans", qty: 10, type: "in" as const, supplier: "PT Toffin Indonesia", date: "2026-03-04", by: "Logan R." },
  { id: "3", item: "Oat Milk", qty: 5, type: "out" as const, supplier: "Waste / Expired", date: "2026-03-04", by: "Theresia H." },
  { id: "4", item: "Caramel Syrup", qty: 6, type: "in" as const, supplier: "PT Monin Indonesia", date: "2026-03-03", by: "Leonard B." },
];

const transfers = [
  { item: "Fresh Milk", qty: 10, from: "Brew Coffee Kuningan", to: "Brew Coffee Sudirman", date: "2026-03-04" },
  { item: "Brew Blend Beans", qty: 5, from: "Warehouse", to: "Brew Coffee Sudirman", date: "2026-03-03" },
  { item: "Oat Milk", qty: 8, from: "Brew Coffee Tebet", to: "Brew Coffee Kuningan", date: "2026-03-02" },
];

export function InventoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"overview" | "detail">("overview");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("Least");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(inventoryItems.map((i) => i.category)))];

  const sorted = [...inventoryItems]
    .filter((i) => categoryFilter === "All" || i.category === categoryFilter)
    .filter((i) => searchQuery ? i.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    .sort((a, b) => sortBy === "Least" ? a.soh - b.soh : b.soh - a.soh);

  const lowStockCount = inventoryItems.filter((i) => i.soh <= i.minStock).length;
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((s, i) => s + i.soh, 0);

  if (view === "detail") {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Inventory Detail" subtitle="Manage stock levels" searchPlaceholder="Search item..." />
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button onClick={() => setView("overview")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
              <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Category</span>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
              <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]">
                <option>Least</option><option>Most</option>
              </select>
            </div>

            <div className="ml-auto flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[12px] hover:bg-[#FAFAFA] transition-colors">
                <Clock className="w-3.5 h-3.5" /> History
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">
                  <th className="text-left px-4 py-3">No</th>
                  <th className="text-left px-4 py-3">Item Name</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">SKU</th>
                  <th className="text-left px-4 py-3">UOM</th>
                  <th className="text-left px-4 py-3">Min</th>
                  <th className="text-left px-4 py-3">SOH</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item, idx) => {
                  const isLow = item.soh <= item.minStock;
                  return (
                    <tr key={item.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors cursor-pointer" onClick={() => { setSelectedItem(item); setShowModal(true); }}>
                      <td className="px-4 py-3 text-[12px] text-[#C4C4C4]">{idx + 1}</td>
                      <td className="px-4 py-3 text-[12px] text-[#1A1A2E]">{item.name}</td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{item.category}</td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF] font-mono">{item.sku}</td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{item.uom}</td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{item.minStock}</td>
                      <td className="px-4 py-3 text-[12px]">
                        <span className={isLow ? "text-[#EF4123]" : "text-[#1A1A2E]"}>{item.soh}</span>
                      </td>
                      <td className="px-4 py-3">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-[#EF4123] text-[10px] rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] rounded-full">OK</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <MoreVertical className="w-4 h-4 text-[#C4C4C4]" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between p-4 border-t border-[#F0F0F0]">
              <p className="text-[11px] text-[#C4C4C4]">Showing {sorted.length} of {totalItems} items</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/inventory/purchase")}
                  className="px-4 py-2.5 bg-[#EF4123] text-white rounded-xl text-[12px] hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25"
                >
                  Pembelian Bahan Baku
                </button>
                <div className="w-px h-6 bg-[#EBEBEB] mx-1"></div>
                <button className="px-4 py-2.5 border border-[#EF4123] text-[#EF4123] rounded-xl text-[12px] hover:bg-[#FEF3F0]">Import CSV</button>
                <button
                  onClick={() => navigate("/inventory/add")}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#EF4123] text-white rounded-xl text-[12px] hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-[420px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] text-[#1A1A2E]">Item Details</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EBEBEB]"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {[
                  ["Name", selectedItem.name],
                  ["Category", selectedItem.category],
                  ["SKU", selectedItem.sku],
                  ["UOM", selectedItem.uom],
                  ["Conversion", selectedItem.conversion],
                  ["Min. Stock", String(selectedItem.minStock)],
                  ["Current SOH", String(selectedItem.soh)],
                  ["Last Restock", selectedItem.lastRestock],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-[#F5F5F5] text-[13px]">
                    <span className="text-[#9CA3AF]">{label}</span>
                    <span className={`text-[#1A1A2E] ${label === "Current SOH" && selectedItem.soh <= selectedItem.minStock ? "text-[#EF4123]" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button className="flex-1 py-3 rounded-xl border border-[#EF4123] text-[#EF4123] text-[12px] hover:bg-[#FEF3F0]">Restock</button>
                <button className="flex-1 py-3 rounded-xl bg-[#EF4123] text-white text-[12px] hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25">Edit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Overview ──
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Inventory" subtitle="Track and manage stock" searchPlaceholder="Search inventory..." />
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#9CA3AF]">Total Items</span>
              <Package className="w-4 h-4 text-[#C4C4C4]" />
            </div>
            <p className="text-[22px] text-[#1A1A2E]">{totalItems}</p>
            <p className="text-[11px] text-[#C4C4C4] mt-1">{totalValue} units in stock</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#9CA3AF]">Low Stock Alert</span>
              <AlertTriangle className="w-4 h-4 text-[#EF4123]" />
            </div>
            <p className="text-[22px] text-[#EF4123]">{lowStockCount}</p>
            <p className="text-[11px] text-[#C4C4C4] mt-1">Items below minimum</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[#9CA3AF]">Last Restock</span>
              <Clock className="w-4 h-4 text-[#C4C4C4]" />
            </div>
            <p className="text-[22px] text-[#1A1A2E]">Today</p>
            <p className="text-[11px] text-[#C4C4C4] mt-1">Fresh Milk, 20 units</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Stock Levels */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] text-[#1A1A2E]">Stock Levels</h2>
              <div className="flex items-center bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg overflow-hidden">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[11px] px-2 py-1.5 border-none focus:outline-none bg-transparent text-[#6B7280]">
                  <option>Least</option><option>Most</option>
                </select>
              </div>
            </div>
            <div className="space-y-2.5">
              {[...inventoryItems].sort((a, b) => a.soh - b.soh).slice(0, 6).map((item) => {
                const pct = Math.min((item.soh / (item.minStock * 3)) * 100, 100);
                const isLow = item.soh <= item.minStock;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <p className="text-[12px] text-[#1A1A2E] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#C4C4C4]">{item.category}</p>
                    </div>
                    <div className="flex-1 h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLow ? "bg-[#EF4123]" : "bg-green-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-[12px] w-8 text-right ${isLow ? "text-[#EF4123]" : "text-[#1A1A2E]"}`}>{item.soh}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-end mt-4">
              <button onClick={() => setView("detail")} className="flex items-center gap-1 text-[12px] text-[#EF4123] hover:underline">
                See All Items <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <h2 className="text-[16px] text-[#1A1A2E] mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {stockMovements.map((mov) => (
                <div key={mov.id} className="flex items-start gap-3 pb-3 border-b border-[#F5F5F5] last:border-none">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mov.type === "in" ? "bg-green-50 text-green-500" : "bg-red-50 text-[#EF4123]"}`}>
                    {mov.type === "in" ? <Plus className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1A2E]">
                      {mov.type === "in" ? "Received" : "Removed"}{" "}
                      <span className={mov.type === "in" ? "text-green-600" : "text-[#EF4123]"}>
                        {mov.type === "in" ? "+" : "-"}{mov.qty}
                      </span>{" "}
                      {mov.item}
                    </p>
                    <p className="text-[10px] text-[#C4C4C4]">{mov.supplier} · {mov.by}</p>
                  </div>
                  <span className="text-[10px] text-[#C4C4C4] shrink-0">{mov.date}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
              <h3 className="text-[13px] text-[#1A1A2E] mb-3">Recent Transfers</h3>
              {transfers.slice(0, 2).map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] mb-2">
                  <span className="text-[#1A1A2E]">{t.item}</span>
                  <span className="text-[#C4C4C4]">·</span>
                  <span className="text-[#9CA3AF]">{t.qty} units</span>
                  <span className="text-[#C4C4C4]">·</span>
                  <span className="text-[#9CA3AF] truncate">{t.from} → {t.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
