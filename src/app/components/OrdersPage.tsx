import { useState } from "react";
import { TopBar } from "./TopBar";
import { orders, formatRupiah, calculateItemPrice, type Order } from "./pos-data";
import { Clock, MapPin, Phone, Utensils, Package, Truck, Timer, CheckCircle2, AlertCircle, ChevronDown, Printer } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Received: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500", label: "New Order" },
  "In Progress": { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", label: "Preparing" },
  Ready: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500", label: "Ready" },
  Completed: { bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300", label: "Done" },
};

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  "Pickup Order": { icon: Package, color: "text-violet-500" },
  "Delivery Order": { icon: Truck, color: "text-blue-500" },
  "Dine In": { icon: Utensils, color: "text-emerald-500" },
};

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const avatarColors = [
  "from-orange-400 to-red-400",
  "from-pink-400 to-rose-400",
  "from-violet-400 to-purple-400",
  "from-teal-400 to-cyan-400",
  "from-blue-400 to-indigo-400",
  "from-amber-400 to-yellow-400",
  "from-emerald-400 to-green-400",
];

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Active" | "Completed">("Active");
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0]);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const getStatus = (order: Order) => localStatuses[order.id] || order.status;

  const filtered = orders.filter((o) => {
    const status = getStatus(o);
    const matchTab = activeTab === "Active" ? status !== "Completed" : status === "Completed";
    const matchSearch = searchQuery
      ? o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.orderNumber.includes(searchQuery)
      : true;
    return matchTab && matchSearch;
  });

  const activeCount = orders.filter((o) => getStatus(o) !== "Completed").length;
  const completedCount = orders.filter((o) => getStatus(o) === "Completed").length;

  const advanceStatus = (orderId: string) => {
    const current = getStatus(orders.find((o) => o.id === orderId)!);
    const flow: Record<string, string> = {
      Received: "In Progress",
      "In Progress": "Ready",
      Ready: "Completed",
    };
    if (flow[current]) {
      setLocalStatuses((prev) => ({ ...prev, [orderId]: flow[current] }));
    }
  };

  const actionLabel: Record<string, string> = {
    Received: "Accept & Prepare",
    "In Progress": "Mark Ready",
    Ready: "Complete Order",
  };

  const selStatus = getStatus(selectedOrder);
  const selConfig = statusConfig[selStatus] || statusConfig.Received;
  const selTypeConfig = typeConfig[selectedOrder.orderType] || typeConfig["Dine In"];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title="App Orders"
        subtitle="Manage incoming and active orders"
        searchPlaceholder="Search order or customer..."
      />

      <div className="flex-1 flex min-h-0 overflow-hidden px-6 pb-4 gap-4">
        {/* Left: Order List */}
        <div className="w-[320px] shrink-0 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-[#F5F5F5] rounded-xl p-1 mb-4">
            {([
              { key: "Active" as const, count: activeCount },
              { key: "Completed" as const, count: completedCount },
            ]).map(({ key, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] transition-all
                  ${activeTab === key
                    ? "bg-white text-[#1A1A2E] shadow-sm"
                    : "text-[#9CA3AF] hover:text-[#6B7280]"
                  }`}
              >
                {key}
                <span className={`min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] px-1
                  ${activeTab === key ? "bg-[#EF4123] text-white" : "bg-[#E8E8E8] text-[#9CA3AF]"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#C4C4C4] gap-2">
                <Package className="w-8 h-8" />
                <p className="text-[12px]">No orders</p>
              </div>
            ) : (
              filtered.map((order, idx) => {
                const status = getStatus(order);
                const cfg = statusConfig[status] || statusConfig.Received;
                const tCfg = typeConfig[order.orderType] || typeConfig["Dine In"];
                const TypeIcon = tCfg.icon;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border transition-all text-left
                      ${selectedOrder?.id === order.id
                        ? "border-[#EF4123] bg-[#FEF3F0]/50"
                        : "border-[#EBEBEB] bg-white hover:border-[#EF4123]/30 hover:shadow-sm"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[11px] shrink-0`}>
                      {initials(order.customer)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] text-[#1A1A2E] truncate">{order.customer}</p>
                        <span className="text-[10px] text-[#C4C4C4] flex items-center gap-0.5 shrink-0">
                          <Clock className="w-3 h-3" />
                          {order.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                          <TypeIcon className={`w-3 h-3 ${tCfg.color}`} />
                          {order.orderType}
                          {order.tableNumber && <span className="text-[#C4C4C4]">· {order.tableNumber}</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <span className="text-[12px] text-[#1A1A2E]">{formatRupiah(order.total)}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Order Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-[#EBEBEB] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[18px] text-[#1A1A2E]">{selectedOrder.orderNumber}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[12px] text-[#9CA3AF]">{selectedOrder.time}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[#9CA3AF]">
                    {(() => { const Icon = selTypeConfig.icon; return <Icon className={`w-3.5 h-3.5 ${selTypeConfig.color}`} />; })()}
                    {selectedOrder.orderType}
                    {selectedOrder.tableNumber && ` · ${selectedOrder.tableNumber}`}
                  </span>
                  {selectedOrder.platform && (
                    <span className="px-2 py-0.5 bg-[#F5F5F5] rounded-md text-[10px] text-[#9CA3AF]">
                      via {selectedOrder.platform}
                    </span>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] ${selConfig.bg} ${selConfig.text}`}>
                <span className={`w-2 h-2 rounded-full ${selConfig.dot}`} />
                {selConfig.label}
              </span>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 p-4 bg-[#FAFAFA] rounded-2xl mb-5">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[0]} flex items-center justify-center text-white text-[11px]`}>
                {initials(selectedOrder.customer)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#1A1A2E]">{selectedOrder.customer}</p>
                <p className="text-[11px] text-[#C4C4C4]">Customer · {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-5">
              <p className="text-[12px] text-[#9CA3AF] mb-3">
                Order Items ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)})
              </p>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-[#FAFAFA] rounded-xl">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#F0F0F0]">
                      <ImageWithFallback src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-[13px] text-[#1A1A2E]">{item.product.name}</p>
                        <span className="text-[12px] text-[#EF4123] shrink-0">x{item.quantity}</span>
                      </div>
                      {(item.type || item.size || item.milk) && (
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                          {item.type && (
                            <span className="flex items-center gap-1 text-[#9CA3AF]">
                              Type: <span className="text-[#6B7280]">{item.type}</span>
                            </span>
                          )}
                          {item.size && (
                            <span className="flex items-center gap-1 text-[#9CA3AF]">
                              Size: <span className="text-[#6B7280]">{item.size}</span>
                            </span>
                          )}
                          {item.sugarLevel && (
                            <span className="flex items-center gap-1 text-[#9CA3AF]">
                              Sugar: <span className="text-[#6B7280]">{item.sugarLevel}</span>
                            </span>
                          )}
                          {item.milk && item.milk !== "No Milk" && (
                            <span className="flex items-center gap-1 text-[#9CA3AF]">
                              Milk: <span className="text-[#6B7280]">{item.milk}</span>
                            </span>
                          )}
                        </div>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-[#EF4123] mt-1 italic">Note: {item.notes}</p>
                      )}
                      <p className="text-[12px] text-[#1A1A2E] mt-1">{formatRupiah(calculateItemPrice(item))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Notes */}
            {selectedOrder.notes && (
              <div className="bg-[#FEF3F0] rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#EF4123]" />
                  <p className="text-[11px] text-[#EF4123]">Customer Notes</p>
                </div>
                <p className="text-[12px] text-[#1A1A2E]">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Financials */}
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Subtotal</span>
                <span className="text-[#1A1A2E]">{formatRupiah(Math.round(selectedOrder.total / 1.11))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">PPN (11%)</span>
                <span className="text-[#1A1A2E]">{formatRupiah(selectedOrder.total - Math.round(selectedOrder.total / 1.11))}</span>
              </div>
              <div className="h-px bg-[#F0F0F0]" />
              <div className="flex justify-between items-center">
                <span className="text-[#1A1A2E]">Total</span>
                <span className="text-[16px] text-[#1A1A2E]">{formatRupiah(selectedOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-[#F0F0F0] shrink-0">
            {selStatus !== "Completed" ? (
              <div className="flex gap-3">
                <button
                  onClick={() => advanceStatus(selectedOrder.id)}
                  className="flex-1 py-3 rounded-xl bg-[#EF4123] text-white text-[13px] hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25"
                >
                  {actionLabel[selStatus] || "Complete"}
                </button>
                {selStatus === "Received" && (
                  <button className="px-6 py-3 rounded-xl border-2 border-[#EF4123] text-[#EF4123] text-[13px] hover:bg-[#FEF3F0] transition-colors">
                    Decline
                  </button>
                )}
                <button className="w-12 h-12 rounded-xl border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FAFAFA] transition-colors shrink-0">
                  <Printer className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 text-[#9CA3AF]">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-[13px]">Order completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
