import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { formatRupiah } from "./pos-data";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart, Users, ArrowRight, Receipt } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const hourlyData = [
  { hour: "7AM", sales: 320000 },
  { hour: "8AM", sales: 580000 },
  { hour: "9AM", sales: 720000 },
  { hour: "10AM", sales: 890000 },
  { hour: "11AM", sales: 650000 },
  { hour: "12PM", sales: 1100000 },
  { hour: "1PM", sales: 980000 },
  { hour: "2PM", sales: 750000 },
  { hour: "3PM", sales: 620000 },
  { hour: "4PM", sales: 480000 },
  { hour: "5PM", sales: 550000 },
];

const categoryBreakdown = [
  { name: "Coffee", value: 62, fill: "#EF4123", id: "cat-coffee" },
  { name: "Non Coffee", value: 15, fill: "#F97316", id: "cat-noncoffee" },
  { name: "Tea", value: 10, fill: "#FBBF24", id: "cat-tea" },
  { name: "Pastries", value: 8, fill: "#34D399", id: "cat-pastries" },
  { name: "Snacks", value: 5, fill: "#60A5FA", id: "cat-snacks" },
];

const weeklyData = [
  { day: "Mon", revenue: 4200000, orders: 128 },
  { day: "Tue", revenue: 3800000, orders: 112 },
  { day: "Wed", revenue: 4500000, orders: 145 },
  { day: "Thu", revenue: 4100000, orders: 134 },
  { day: "Fri", revenue: 5200000, orders: 168 },
  { day: "Sat", revenue: 6800000, orders: 215 },
  { day: "Sun", revenue: 5900000, orders: 192 },
];

const topProducts = [
  { name: "Caffe Latte", qty: 847, revenue: 27104000 },
  { name: "Cold Brew", qty: 723, revenue: 21690000 },
  { name: "Cappuccino", qty: 654, revenue: 19620000 },
  { name: "Matcha Latte", qty: 512, revenue: 17920000 },
  { name: "Caramel Macchiato", qty: 489, revenue: 18582000 },
  { name: "Americano", qty: 478, revenue: 12428000 },
];

const paymentBreakdown = [
  { method: "QRIS", amount: 12500000, pct: 38 },
  { method: "GoPay", amount: 6800000, pct: 21 },
  { method: "Cash", amount: 5200000, pct: 16 },
  { method: "DANA", amount: 3900000, pct: 12 },
  { method: "Debit", amount: 2600000, pct: 8 },
  { method: "Others", amount: 1640000, pct: 5 },
];

const statCards = [
  { label: "Today's Revenue", value: formatRupiah(7640000), change: "+12.5%", up: true, icon: DollarSign, color: "bg-[#FEF3F0] text-[#EF4123]" },
  { label: "Total Orders", value: "201", change: "+8.3%", up: true, icon: ShoppingCart, color: "bg-blue-50 text-blue-500" },
  { label: "Avg. Order Value", value: formatRupiah(38000), change: "+3.7%", up: true, icon: Receipt, color: "bg-green-50 text-green-500" },
  { label: "Customers", value: "186", change: "-2.1%", up: false, icon: Users, color: "bg-amber-50 text-amber-500" },
];

export function ReportPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState("Today");

  const completionPct = 70;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Overview" subtitle="Sales performance and analytics" searchPlaceholder="Search reports..." />

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Period selector & View Detailed Button */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {["Today", "This Week", "This Month"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-[12px] border transition-all
                  ${period === p
                    ? "bg-[#EF4123] text-white border-[#EF4123] shadow-sm shadow-[#EF4123]/20"
                    : "bg-white text-[#6B7280] border-[#EBEBEB] hover:border-[#EF4123]/30"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/report/top-products")} className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#6B7280] rounded-xl text-[12px] border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors">
              Produk Terlaris
            </button>
            <button onClick={() => navigate("/report/promo")} className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#6B7280] rounded-xl text-[12px] border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors">
              Promo & Diskon
            </button>
            <button
              onClick={() => navigate("/report/detailed")}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#EF4123] text-white rounded-xl text-[12px] hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25 transition-colors"
            >
              View Detailed Reports <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-[#9CA3AF]">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[20px] text-[#1A1A2E] leading-tight">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-[11px] ${stat.up ? "text-green-500" : "text-red-400"}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change} vs yesterday
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[16px] text-[#1A1A2E]">Sales Trend</h2>
                <p className="text-[12px] text-[#C4C4C4]">Hourly revenue today</p>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-green-500">
                <TrendingUp className="w-3.5 h-3.5" /> Peak at 12PM
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="reportSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4123" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#EF4123" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #EBEBEB", fontSize: 12 }}
                    formatter={(value: number) => [formatRupiah(value), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#EF4123" strokeWidth={2} fill="url(#reportSalesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <h2 className="text-[16px] text-[#1A1A2E] mb-1">Sales by Category</h2>
            <p className="text-[12px] text-[#C4C4C4] mb-4">Percentage of total orders</p>
            <div className="flex justify-center mb-4">
              <PieChart width={160} height={160}>
                <Pie data={categoryBreakdown} cx={80} cy={80} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name">
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {categoryBreakdown.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.fill }} />
                    <span className="text-[#6B7280]">{cat.name}</span>
                  </div>
                  <span className="text-[#1A1A2E]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] text-[#1A1A2E]">Top Products</h2>
              <button className="flex items-center gap-1 text-[11px] text-[#EF4123] hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-[#C4C4C4]">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.name} className="border-t border-[#F5F5F5]">
                    <td className="py-2.5 text-[#C4C4C4]">{i + 1}</td>
                    <td className="py-2.5 text-[#1A1A2E]">{p.name}</td>
                    <td className="py-2.5 text-right text-[#6B7280]">{p.qty}</td>
                    <td className="py-2.5 text-right text-[#1A1A2E]">{formatRupiah(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <h2 className="text-[16px] text-[#1A1A2E] mb-4">Payment Methods</h2>
            <div className="space-y-3">
              {paymentBreakdown.map((pm) => (
                <div key={pm.method}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="text-[#6B7280]">{pm.method}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1A1A2E]">{formatRupiah(pm.amount)}</span>
                      <span className="text-[#C4C4C4] w-8 text-right">{pm.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4123] rounded-full transition-all" style={{ width: `${pm.pct}%`, opacity: 0.4 + (pm.pct / 100) * 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[16px] text-[#1A1A2E]">Weekly Performance</h2>
              <p className="text-[12px] text-[#C4C4C4]">Revenue & orders this week</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EBEBEB", fontSize: 12 }} formatter={(value: number, name: string) => [name === "revenue" ? formatRupiah(value) : value, name === "revenue" ? "Revenue" : "Orders"]} />
                <Bar dataKey="revenue" yAxisId="revenue" fill="#EF4123" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}