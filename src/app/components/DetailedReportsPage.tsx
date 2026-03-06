import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { formatRupiah } from "./pos-data";
import { ArrowLeft, Download, TrendingUp, TrendingDown, Tag, Calendar, Package, Filter, ChevronDown } from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const promoData = [
  { id: 1, name: "Diskon Weekend 15%", code: "WKND15", discount: 15, type: "Percentage", usage: 247, revenue: 8640000, startDate: "2026-03-01", endDate: "2026-03-31", status: "Active" },
  { id: 2, name: "Beli 2 Gratis 1", code: "BUY2GET1", discount: 0, type: "Buy X Get Y", usage: 183, revenue: 6420000, startDate: "2026-02-15", endDate: "2026-03-15", status: "Active" },
  { id: 3, name: "Member Cashback 20%", code: "MEMBER20", discount: 20, type: "Cashback", usage: 156, revenue: 5460000, startDate: "2026-03-01", endDate: "2026-03-31", status: "Active" },
  { id: 4, name: "Flash Sale Pagi", code: "MORNING", discount: 25, type: "Percentage", usage: 98, revenue: 2940000, startDate: "2026-03-01", endDate: "2026-03-07", status: "Expired" },
  { id: 5, name: "Promo Payday", code: "PAYDAY10", discount: 10, type: "Percentage", usage: 312, revenue: 10920000, startDate: "2026-02-25", endDate: "2026-03-05", status: "Expired" },
];

const dailySalesData = [
  { date: "2026-03-06", revenue: 7640000, orders: 201, avgOrder: 38000, topProduct: "Caffe Latte", topQty: 38, growth: 12.5 },
  { date: "2026-03-05", revenue: 6790000, orders: 189, avgOrder: 35900, topProduct: "Cold Brew", topQty: 35, growth: -3.2 },
  { date: "2026-03-04", revenue: 7010000, orders: 195, avgOrder: 35900, topProduct: "Cappuccino", topQty: 32, growth: 8.7 },
  { date: "2026-03-03", revenue: 6450000, orders: 178, avgOrder: 36200, topProduct: "Caffe Latte", topQty: 29, growth: -5.1 },
  { date: "2026-03-02", revenue: 6800000, orders: 187, avgOrder: 36400, topProduct: "Matcha Latte", topQty: 31, growth: 4.3 },
  { date: "2026-03-01", revenue: 6520000, orders: 182, avgOrder: 35800, topProduct: "Americano", topQty: 28, growth: 2.8 },
  { date: "2026-02-29", revenue: 6340000, orders: 175, avgOrder: 36200, topProduct: "Caffe Latte", topQty: 27, growth: -1.5 },
];

const weeklySalesData = [
  { week: "Week 1 (Mar 1-7)", revenue: 34500000, orders: 978, avgOrder: 35300, topProduct: "Caffe Latte", growth: 8.4 },
  { week: "Week 5 (Feb 23-29)", revenue: 31800000, orders: 902, avgOrder: 35200, topProduct: "Cold Brew", growth: 5.2 },
  { week: "Week 4 (Feb 16-22)", revenue: 30200000, orders: 865, avgOrder: 34900, topProduct: "Cappuccino", growth: -2.1 },
  { week: "Week 3 (Feb 9-15)", revenue: 30850000, orders: 880, avgOrder: 35100, topProduct: "Matcha Latte", growth: 3.7 },
];

const monthlySalesData = [
  { month: "Maret 2026", revenue: 34500000, orders: 978, avgOrder: 35300, topProduct: "Caffe Latte", growth: 8.4, daysElapsed: 6, projectedRevenue: 172500000 },
  { month: "Februari 2026", revenue: 124600000, orders: 3542, avgOrder: 35200, topProduct: "Cold Brew", growth: 12.3, daysElapsed: 29, projectedRevenue: 124600000 },
  { month: "Januari 2026", revenue: 110900000, orders: 3154, avgOrder: 35200, topProduct: "Cappuccino", growth: 7.8, daysElapsed: 31, projectedRevenue: 110900000 },
  { month: "Desember 2025", revenue: 102800000, orders: 2925, avgOrder: 35100, topProduct: "Caramel Macchiato", growth: 15.2, daysElapsed: 31, projectedRevenue: 102800000 },
];

const topProductsDetailed = [
  { id: 1, name: "Caffe Latte", category: "Coffee", qty: 847, revenue: 27104000, growth: 12.5, margin: 68, avgPrice: 32000 },
  { id: 2, name: "Cold Brew", category: "Coffee", qty: 723, revenue: 21690000, growth: 8.3, margin: 72, avgPrice: 30000 },
  { id: 3, name: "Cappuccino", category: "Coffee", qty: 654, revenue: 19620000, growth: -2.1, margin: 65, avgPrice: 30000 },
  { id: 4, name: "Matcha Latte", category: "Non Coffee", qty: 512, revenue: 17920000, growth: 15.7, margin: 70, avgPrice: 35000 },
  { id: 5, name: "Caramel Macchiato", category: "Coffee", qty: 489, revenue: 18582000, growth: 10.2, margin: 66, avgPrice: 38000 },
  { id: 6, name: "Americano", category: "Coffee", qty: 478, revenue: 12428000, growth: 5.4, margin: 75, avgPrice: 26000 },
  { id: 7, name: "Mocha", category: "Coffee", qty: 412, revenue: 14832000, growth: 7.8, margin: 64, avgPrice: 36000 },
  { id: 8, name: "Flat White", category: "Coffee", qty: 389, revenue: 13226000, growth: 6.2, margin: 67, avgPrice: 34000 },
  { id: 9, name: "Vanilla Latte", category: "Coffee", qty: 345, revenue: 12075000, growth: -5.3, margin: 66, avgPrice: 35000 },
  { id: 10, name: "Iced Chocolate", category: "Non Coffee", qty: 298, revenue: 9536000, growth: 9.1, margin: 69, avgPrice: 32000 },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export function DetailedReportsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("promo"); // promo, sales, products
  const [salesPeriod, setSalesPeriod] = useState("daily"); // daily, weekly, monthly
  const [dateFilter, setDateFilter] = useState("all");

  const tabs = [
    { id: "promo", label: "Promo & Diskon", icon: Tag },
    { id: "sales", label: "Penjualan", icon: Calendar },
    { id: "products", label: "Produk Terlaris", icon: Package },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title="Detailed Reports"
        subtitle="Comprehensive sales analytics and insights"
        searchPlaceholder="Search reports..."
      />
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/report")}
          className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5 border-b border-[#EBEBEB]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[13px] border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#EF4123] text-[#EF4123]"
                  : "border-transparent text-[#6B7280] hover:text-[#EF4123]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "promo" && <PromoDiskonTab />}
        {activeTab === "sales" && <PenjualanTab period={salesPeriod} onPeriodChange={setSalesPeriod} />}
        {activeTab === "products" && <ProdukTerlarisTab />}
      </div>
    </div>
  );
}

// ─── Promo & Diskon Tab ──────────────────────────────────────────────────────
function PromoDiskonTab() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = promoData.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status.toLowerCase() === statusFilter;
  });

  const totalRevenue = filtered.reduce((sum, p) => sum + p.revenue, 0);
  const totalUsage = filtered.reduce((sum, p) => sum + p.usage, 0);
  const activePromos = promoData.filter((p) => p.status === "Active").length;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Revenue from Promos</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Usage</p>
          <p className="text-[20px] text-[#1A1A2E]">{totalUsage.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Active Promos</p>
          <p className="text-[20px] text-[#1A1A2E]">{activePromos}</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
            <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <span className="text-[12px] text-[#C4C4C4]">{filtered.length} promos</span>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[12px] hover:bg-[#FAFAFA]">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[#C4C4C4] bg-[#FAFAFA]">
              <th className="text-left px-4 py-3">Promo Name</th>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-right px-4 py-3">Discount</th>
              <th className="text-right px-4 py-3">Usage</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-left px-4 py-3">Period</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((promo) => (
              <tr key={promo.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                <td className="px-4 py-3 text-[#1A1A2E]">{promo.name}</td>
                <td className="px-4 py-3 text-[#6B7280] font-mono text-[11px]">{promo.code}</td>
                <td className="px-4 py-3 text-[#6B7280]">{promo.type}</td>
                <td className="px-4 py-3 text-right text-[#1A1A2E]">
                  {promo.discount > 0 ? `${promo.discount}%` : "-"}
                </td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{promo.usage}x</td>
                <td className="px-4 py-3 text-right text-[#1A1A2E]">{formatRupiah(promo.revenue)}</td>
                <td className="px-4 py-3 text-[#6B7280]">
                  {new Date(promo.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} -{" "}
                  {new Date(promo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${
                      promo.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {promo.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Penjualan Tab ───────────────────────────────────────────────────────────
function PenjualanTab({ period, onPeriodChange }: { period: string; onPeriodChange: (p: string) => void }) {
  return (
    <div>
      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-5">
        {[
          { id: "daily", label: "Harian" },
          { id: "weekly", label: "Mingguan" },
          { id: "monthly", label: "Bulanan" },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => onPeriodChange(p.id)}
            className={`px-4 py-2 rounded-xl text-[12px] border transition-all ${
              period === p.id
                ? "bg-[#EF4123] text-white border-[#EF4123] shadow-sm shadow-[#EF4123]/20"
                : "bg-white text-[#6B7280] border-[#EBEBEB] hover:border-[#EF4123]/30"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "daily" && <DailySalesView />}
      {period === "weekly" && <WeeklySalesView />}
      {period === "monthly" && <MonthlySalesView />}
    </div>
  );
}

function DailySalesView() {
  const totalRevenue = dailySalesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = dailySalesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Revenue (7 days)</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Orders</p>
          <p className="text-[20px] text-[#1A1A2E]">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Avg. Order Value</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(avgOrderValue)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <h3 className="text-[14px] text-[#1A1A2E]">Daily Sales Report</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[11px] hover:bg-[#FAFAFA]">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[#C4C4C4] bg-[#FAFAFA]">
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Avg. Order</th>
              <th className="text-left px-4 py-3">Top Product</th>
              <th className="text-right px-4 py-3">Qty Sold</th>
              <th className="text-right px-4 py-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {dailySalesData.map((day) => (
              <tr key={day.date} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                <td className="px-4 py-3 text-[#1A1A2E]">
                  {new Date(day.date).toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right text-[#1A1A2E]">{formatRupiah(day.revenue)}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{day.orders}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{formatRupiah(day.avgOrder)}</td>
                <td className="px-4 py-3 text-[#1A1A2E]">{day.topProduct}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{day.topQty}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`flex items-center justify-end gap-1 ${
                      day.growth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {day.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(day.growth).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WeeklySalesView() {
  const totalRevenue = weeklySalesData.reduce((sum, w) => sum + w.revenue, 0);
  const totalOrders = weeklySalesData.reduce((sum, w) => sum + w.orders, 0);
  const avgWeeklyRevenue = totalRevenue / weeklySalesData.length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Revenue (4 weeks)</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Orders</p>
          <p className="text-[20px] text-[#1A1A2E]">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Avg. Weekly Revenue</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(avgWeeklyRevenue)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <h3 className="text-[14px] text-[#1A1A2E]">Weekly Sales Report</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[11px] hover:bg-[#FAFAFA]">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[#C4C4C4] bg-[#FAFAFA]">
              <th className="text-left px-4 py-3">Week Period</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Avg. Order</th>
              <th className="text-left px-4 py-3">Top Product</th>
              <th className="text-right px-4 py-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {weeklySalesData.map((week) => (
              <tr key={week.week} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                <td className="px-4 py-3 text-[#1A1A2E]">{week.week}</td>
                <td className="px-4 py-3 text-right text-[#1A1A2E]">{formatRupiah(week.revenue)}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{week.orders}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{formatRupiah(week.avgOrder)}</td>
                <td className="px-4 py-3 text-[#1A1A2E]">{week.topProduct}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`flex items-center justify-end gap-1 ${
                      week.growth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {week.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(week.growth).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonthlySalesView() {
  const currentMonth = monthlySalesData[0];
  const previousMonth = monthlySalesData[1];
  const avgMonthlyRevenue = monthlySalesData.slice(1).reduce((sum, m) => sum + m.revenue, 0) / 3;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Current Month Revenue</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(currentMonth.revenue)}</p>
          <p className="text-[11px] text-[#9CA3AF] mt-1">Projected: {formatRupiah(currentMonth.projectedRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Previous Month</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(previousMonth.revenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">3-Month Average</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(avgMonthlyRevenue)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <h3 className="text-[14px] text-[#1A1A2E]">Monthly Sales Report</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[11px] hover:bg-[#FAFAFA]">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[#C4C4C4] bg-[#FAFAFA]">
              <th className="text-left px-4 py-3">Month</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Avg. Order</th>
              <th className="text-left px-4 py-3">Top Product</th>
              <th className="text-right px-4 py-3">Days</th>
              <th className="text-right px-4 py-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {monthlySalesData.map((month) => (
              <tr key={month.month} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                <td className="px-4 py-3 text-[#1A1A2E]">{month.month}</td>
                <td className="px-4 py-3 text-right text-[#1A1A2E]">{formatRupiah(month.revenue)}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{month.orders.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{formatRupiah(month.avgOrder)}</td>
                <td className="px-4 py-3 text-[#1A1A2E]">{month.topProduct}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{month.daysElapsed} days</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`flex items-center justify-end gap-1 ${
                      month.growth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {month.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(month.growth).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Produk Terlaris Tab ─────────────────────────────────────────────────────
function ProdukTerlarisTab() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = topProductsDetailed.filter((p) => {
    if (categoryFilter === "all") return true;
    return p.category === categoryFilter;
  });

  const totalRevenue = filtered.reduce((sum, p) => sum + p.revenue, 0);
  const totalQty = filtered.reduce((sum, p) => sum + p.qty, 0);
  const avgMargin = filtered.reduce((sum, p) => sum + p.margin, 0) / filtered.length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Revenue</p>
          <p className="text-[20px] text-[#1A1A2E]">{formatRupiah(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Total Quantity Sold</p>
          <p className="text-[20px] text-[#1A1A2E]">{totalQty.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
          <p className="text-[12px] text-[#9CA3AF] mb-1">Avg. Profit Margin</p>
          <p className="text-[20px] text-[#1A1A2E]">{avgMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
            <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]"
            >
              <option value="all">All</option>
              <option value="Coffee">Coffee</option>
              <option value="Non Coffee">Non Coffee</option>
            </select>
          </div>
          <span className="text-[12px] text-[#C4C4C4]">{filtered.length} products</span>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[12px] hover:bg-[#FAFAFA]">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-[#C4C4C4] bg-[#FAFAFA]">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Product Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-right px-4 py-3">Qty Sold</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Avg. Price</th>
              <th className="text-right px-4 py-3">Margin</th>
              <th className="text-right px-4 py-3">Growth</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, index) => (
              <tr key={product.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors">
                <td className="px-4 py-3 text-[#C4C4C4]">{index + 1}</td>
                <td className="px-4 py-3 text-[#1A1A2E]">{product.name}</td>
                <td className="px-4 py-3 text-[#6B7280]">{product.category}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{product.qty}</td>
                <td className="px-4 py-3 text-right text-[#1A1A2E]">{formatRupiah(product.revenue)}</td>
                <td className="px-4 py-3 text-right text-[#6B7280]">{formatRupiah(product.avgPrice)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-green-600">{product.margin}%</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`flex items-center justify-end gap-1 ${
                      product.growth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {product.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(product.growth).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
