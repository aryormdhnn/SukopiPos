import { useState, useCallback, useRef } from "react";
import { TopBar } from "./TopBar";
import {
  Plus,
  Minus,
  Trash2,
  Check,
  X,
  ShoppingBag,
  Coffee,
  Zap,
  Leaf,
  UtensilsCrossed,
  Cookie,
  Flame,
  Snowflake,
  Edit3,
  QrCode,
  CreditCard,
  Wallet,
  Banknote,
  Sofa,
  TreePine,
  Star,
  ChevronDown,
  ReceiptText,
  Printer,
  CircleCheck,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  categories,
  products,
  formatRupiah,
  calculateItemPrice,
  getCategoryCount,
  paymentMethods,
  drinkTypes,
  drinkSizes,
  sugarLevels,
  milkTypes,
  addOnOptions,
  sizePriceExtra,
  type Category,
  type Product,
  type OrderItem,
  type DrinkType,
  type DrinkSize,
  type SugarLevel,
  type MilkType,
} from "./pos-data";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee: Coffee,
  "Non Coffee": Zap,
  Tea: Leaf,
  Pastries: UtensilsCrossed,
  Snacks: Cookie,
};

const isBeverage = (cat: Category) => ["Coffee", "Non Coffee", "Tea"].includes(cat);

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<"Dine in" | "Take away">("Dine in");
  const [seatingArea, setSeatingArea] = useState<"Indoor" | "Outdoor">("Indoor");
  const [tableNumber, setTableNumber] = useState("T-01");
  const [selectedPayment, setSelectedPayment] = useState<string>("qris");
  const [paymentStep, setPaymentStep] = useState<"order" | "payment" | "success">("order");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [customerInput, setCustomerInput] = useState("");
  const [orderCounter, setOrderCounter] = useState(8);

  // Customization modal
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customType, setCustomType] = useState<DrinkType>("Iced");
  const [customSize, setCustomSize] = useState<DrinkSize>("Regular");
  const [customSugar, setCustomSugar] = useState<SugarLevel>("Normal");
  const [customMilk, setCustomMilk] = useState<MilkType>("Fresh Milk");
  const [customAddOns, setCustomAddOns] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return searchQuery ? matchesSearch : matchesCat;
  });

  const openCustomization = (product: Product) => {
    if (product.stock === 0) return;
    if (isBeverage(product.category)) {
      setCustomizingProduct(product);
      setCustomType("Iced");
      setCustomSize("Regular");
      setCustomSugar("Normal");
      setCustomMilk(product.category === "Tea" && product.subCategory !== "Latte" ? "No Milk" : "Fresh Milk");
      setCustomAddOns([]);
      setCustomNotes("");
    } else {
      // Non-beverage: add directly
      addToOrder(product);
    }
  };

  const addToOrder = (product: Product, opts?: Partial<OrderItem>) => {
    setOrderItems((prev) => {
      const key = `${product.id}-${opts?.type || ""}-${opts?.size || ""}-${opts?.milk || ""}`;
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.type === (opts?.type || undefined) &&
          item.size === (opts?.size || undefined) &&
          item.milk === (opts?.milk || undefined)
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, notes: opts?.notes || "", ...opts }];
    });
  };

  const confirmCustomization = () => {
    if (!customizingProduct) return;
    addToOrder(customizingProduct, {
      type: customType,
      size: customSize,
      sugarLevel: customSugar,
      milk: customMilk,
      addOns: customAddOns.length > 0 ? customAddOns : undefined,
      notes: customNotes,
    });
    setCustomizingProduct(null);
  };

  const handleUpdateQuantity = useCallback((idx: number, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item, i) => (i === idx ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((idx: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const subtotal = orderItems.reduce((s, i) => s + calculateItemPrice(i), 0);
  const tax = Math.round(subtotal * 0.11); // PPN 11%
  const total = subtotal + tax;
  const itemCount = orderItems.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (orderItems.length === 0) return;
    setPaymentStep("payment");
  };

  const handleConfirmPayment = () => {
    setPaymentStep("success");
    setTimeout(() => {
      setPaymentStep("order");
      setOrderItems([]);
      setSelectedPayment("qris");
      setCustomerName("Walk-in Customer");
      setOrderCounter((c) => c + 1);
    }, 2500);
  };

  const getItemDesc = (item: OrderItem) => {
    const parts: string[] = [];
    if (item.type) parts.push(item.type);
    if (item.size) parts.push(item.size);
    if (item.milk && item.milk !== "No Milk") parts.push(item.milk);
    return parts.join(" · ");
  };

  const customizationPrice = customizingProduct
    ? customizingProduct.price +
      sizePriceExtra[customSize] +
      customAddOns.reduce((s, id) => {
        const ao = addOnOptions.find((a) => a.id === id);
        return s + (ao?.price || 0);
      }, 0)
    : 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex-1 flex min-h-0 overflow-hidden gap-0">
        {/* ── Left: Product Area ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden px-6 pb-4">
          {/* Category Chips */}
          <div className="flex gap-2.5 mb-5 shrink-0 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-[13px] whitespace-nowrap
                ${activeCategory === "All"
                  ? "bg-[#EF4123] text-white border-[#EF4123] shadow-sm shadow-[#EF4123]/20"
                  : "bg-white text-[#6B7280] border-[#EBEBEB] hover:border-[#EF4123]/30"
                }`}
            >
              <ReceiptText className="w-4 h-4" />
              All Menu
              <span className={`text-[11px] ${activeCategory === "All" ? "text-white/70" : "text-[#C4C4C4]"}`}>
                {products.length}
              </span>
            </button>
            {(["Coffee", "Non Coffee", "Tea", "Pastries", "Snacks"] as Category[]).map((cat) => {
              const Icon = categoryIcons[cat];
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? "All" : cat)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-[13px] whitespace-nowrap
                    ${activeCategory === cat
                      ? "bg-[#EF4123] text-white border-[#EF4123] shadow-sm shadow-[#EF4123]/20"
                      : "bg-white text-[#6B7280] border-[#EBEBEB] hover:border-[#EF4123]/30"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat}
                  <span className={`text-[11px] ${activeCategory === cat ? "text-white/70" : "text-[#C4C4C4]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const outOfStock = product.stock === 0;
                const inOrder = orderItems.some((i) => i.product.id === product.id);
                const qty = orderItems.filter((i) => i.product.id === product.id).reduce((s, i) => s + i.quantity, 0);
                return (
                  <button
                    key={product.id}
                    onClick={() => openCustomization(product)}
                    disabled={outOfStock}
                    className={`relative bg-white rounded-2xl overflow-hidden border text-left transition-all group
                      ${inOrder ? "border-[#EF4123] ring-1 ring-[#EF4123]/15" : "border-[#EBEBEB]"}
                      ${outOfStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-black/5 hover:border-[#EF4123]/30 active:scale-[0.98]"}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {product.isBestSeller && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400 text-white text-[9px] rounded-md">
                            <Star className="w-2.5 h-2.5" /> Best
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-1.5 py-0.5 bg-[#EF4123] text-white text-[9px] rounded-md">New</span>
                        )}
                        {product.discount && (
                          <span className="px-1.5 py-0.5 bg-green-500 text-white text-[9px] rounded-md">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      {inOrder && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#EF4123] rounded-full flex items-center justify-center text-white text-[10px] shadow-md">
                          {qty}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[13px] text-[#1A1A2E] truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] text-[#1A1A2E]">{formatRupiah(product.price)}</span>
                        {product.oldPrice && (
                          <span className="text-[11px] text-[#C4C4C4] line-through">{formatRupiah(product.oldPrice)}</span>
                        )}
                      </div>
                    </div>
                    {outOfStock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="px-3 py-1 bg-[#1A1A2E] text-white text-[11px] rounded-full">Sold Out</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-[#C4C4C4] gap-2">
                <Coffee className="w-8 h-8" />
                <p className="text-[13px]">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Order Panel ── */}
        <div className="w-[300px] bg-white border-l border-[#EBEBEB] flex flex-col shrink-0 overflow-hidden">
          {paymentStep === "success" ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CircleCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[18px] text-[#1A1A2E] mt-2">Payment Successful</h3>
              <p className="text-[13px] text-[#9CA3AF]">Order #{String(orderCounter).padStart(3, "0")}</p>
              <p className="text-[22px] text-[#1A1A2E]">{formatRupiah(total)}</p>
              <div className="flex gap-3 mt-4 w-full">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#EBEBEB] rounded-xl text-[12px] text-[#6B7280] hover:bg-[#FAFAFA]">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#EBEBEB] rounded-xl text-[12px] text-[#6B7280] hover:bg-[#FAFAFA]">
                  <ReceiptText className="w-3.5 h-3.5" /> E-Receipt
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Customer Header */}
              <div className="px-4 py-4 border-b border-[#F0F0F0] shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {editingCustomer ? (
                      <div className="flex items-center gap-1">
                        <input
                          autoFocus
                          className="text-[13px] border border-[#EF4123] rounded-lg px-2 py-1 w-32 focus:outline-none"
                          value={customerInput}
                          onChange={(e) => setCustomerInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setCustomerName(customerInput || "Walk-in Customer");
                              setEditingCustomer(false);
                            }
                          }}
                          onBlur={() => {
                            setCustomerName(customerInput || "Walk-in Customer");
                            setEditingCustomer(false);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] text-[#1A1A2E]">{customerName}</span>
                        <button
                          onClick={() => { setCustomerInput(customerName === "Walk-in Customer" ? "" : customerName); setEditingCustomer(true); }}
                          className="text-[#C4C4C4] hover:text-[#EF4123] transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-[#C4C4C4]">
                      #ORD-{new Date().toISOString().slice(0, 10).replace(/-/g, "")}-{String(orderCounter + 1).padStart(3, "0")}
                    </p>
                  </div>
                  {/* Order type toggle */}
                  <div className="flex bg-[#F5F5F5] rounded-lg p-0.5">
                    {(["Dine in", "Take away"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`px-3 py-1.5 text-[11px] rounded-md transition-all
                          ${orderType === type
                            ? "bg-white text-[#EF4123] shadow-sm"
                            : "text-[#9CA3AF] hover:text-[#6B7280]"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating / Table */}
                {orderType === "Dine in" && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <p className="text-[10px] text-[#C4C4C4] mb-1.5">Seating</p>
                      <div className="flex gap-1.5">
                        {(["Indoor", "Outdoor"] as const).map((area) => (
                          <button
                            key={area}
                            onClick={() => setSeatingArea(area)}
                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-[11px] transition-all
                              ${seatingArea === area
                                ? "border-[#EF4123] text-[#EF4123] bg-[#FEF3F0]"
                                : "border-[#EBEBEB] text-[#9CA3AF] hover:border-[#EF4123]/30"
                              }`}
                          >
                            {area === "Indoor" ? <Sofa className="w-3 h-3" /> : <TreePine className="w-3 h-3" />}
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-20">
                      <p className="text-[10px] text-[#C4C4C4] mb-1.5">Table</p>
                      <select
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full py-2 px-2 rounded-lg border border-[#EBEBEB] text-[11px] text-[#1A1A2E] focus:outline-none focus:border-[#EF4123]/40 bg-white"
                      >
                        {Array.from({ length: 12 }, (_, i) => `T-${String(i + 1).padStart(2, "0")}`).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] text-[#9CA3AF]">Order Items</p>
                  {orderItems.length > 0 && (
                    <span className="text-[11px] text-[#EF4123]">{itemCount} items</span>
                  )}
                </div>

                {orderItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#D4D4D4] gap-2">
                    <ShoppingBag className="w-10 h-10" />
                    <p className="text-[12px] text-[#C4C4C4]">Tap a product to start</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                          <ImageWithFallback src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#1A1A2E] truncate">{item.product.name}</p>
                          {getItemDesc(item) && (
                            <p className="text-[10px] text-[#C4C4C4] truncate">{getItemDesc(item)}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <button
                              onClick={() => handleUpdateQuantity(idx, -1)}
                              className="w-6 h-6 rounded-md border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FEF3F0] hover:border-[#EF4123]/30 transition-colors"
                            >
                              <Minus className="w-3 h-3 text-[#6B7280]" />
                            </button>
                            <span className="w-5 text-center text-[12px] text-[#EF4123]">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(idx, 1)}
                              className="w-6 h-6 rounded-md border border-[#EBEBEB] flex items-center justify-center hover:bg-[#FEF3F0] hover:border-[#EF4123]/30 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-[#6B7280]" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="opacity-0 group-hover:opacity-100 text-[#EF4123] hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[12px] text-[#1A1A2E]">{formatRupiah(calculateItemPrice(item))}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {orderItems.length > 0 && (
                <div className="border-t border-[#F0F0F0] px-4 py-3 space-y-3 shrink-0">
                  {paymentStep === "order" ? (
                    <>
                      <div className="space-y-1.5 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-[#9CA3AF]">Subtotal</span>
                          <span className="text-[#1A1A2E]">{formatRupiah(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9CA3AF]">PPN (11%)</span>
                          <span className="text-[#1A1A2E]">{formatRupiah(tax)}</span>
                        </div>
                        <div className="h-px bg-[#F0F0F0]" />
                        <div className="flex justify-between items-center">
                          <span className="text-[#1A1A2E] text-[13px]">Total</span>
                          <span className="text-[16px] text-[#1A1A2E]">{formatRupiah(total)}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-3 rounded-xl bg-[#EF4123] text-white text-[13px] hover:bg-[#D93A1F] transition-colors active:scale-[0.98] shadow-sm shadow-[#EF4123]/25"
                      >
                        Proceed to Payment
                      </button>
                    </>
                  ) : paymentStep === "payment" ? (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <button onClick={() => setPaymentStep("order")} className="text-[12px] text-[#9CA3AF] hover:text-[#EF4123]">&larr; Back</button>
                        <span className="text-[16px] text-[#1A1A2E]">{formatRupiah(total)}</span>
                      </div>
                      <p className="text-[11px] text-[#C4C4C4] mb-2">Select payment method</p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {paymentMethods.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedPayment(m.id)}
                            className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all text-[10px]
                              ${selectedPayment === m.id
                                ? "border-[#EF4123] bg-[#FEF3F0] text-[#EF4123]"
                                : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                              }`}
                          >
                            {m.icon === "qr" && <QrCode className="w-4 h-4" />}
                            {m.icon === "wallet" && <Wallet className="w-4 h-4" />}
                            {m.icon === "cash" && <Banknote className="w-4 h-4" />}
                            {m.icon === "card" && <CreditCard className="w-4 h-4" />}
                            <span>{m.name}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleConfirmPayment}
                        disabled={!selectedPayment}
                        className="w-full py-3 rounded-xl bg-[#EF4123] text-white text-[13px] hover:bg-[#D93A1F] transition-colors active:scale-[0.98] shadow-sm shadow-[#EF4123]/25 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                      >
                        Confirm Payment
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Customization Modal ── */}
      {customizingProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setCustomizingProduct(null)}>
          <div className="bg-white rounded-2xl w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Product image */}
            <div className="relative h-44 overflow-hidden rounded-t-2xl">
              <ImageWithFallback src={customizingProduct.image} alt={customizingProduct.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setCustomizingProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-md"
              >
                <X className="w-4 h-4 text-[#1A1A2E]" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-[16px] text-[#1A1A2E]">{customizingProduct.name}</h3>
                {customizingProduct.description && (
                  <p className="text-[12px] text-[#9CA3AF] mt-1">{customizingProduct.description}</p>
                )}
              </div>

              {/* Type: Hot / Iced */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2">Type</p>
                <div className="flex gap-2">
                  {drinkTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setCustomType(t)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[12px] transition-all
                        ${customType === t
                          ? "border-[#EF4123] text-[#EF4123] bg-[#FEF3F0]"
                          : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                        }`}
                    >
                      {t === "Hot" ? <Flame className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2">Size</p>
                <div className="flex gap-2">
                  {drinkSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setCustomSize(s)}
                      className={`flex-1 py-2.5 rounded-xl border text-[12px] transition-all text-center
                        ${customSize === s
                          ? "border-[#EF4123] text-[#EF4123] bg-[#FEF3F0]"
                          : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                        }`}
                    >
                      {s}
                      {s === "Large" && <span className="text-[10px] text-[#C4C4C4] ml-1">(+{formatRupiah(6000)})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sugar */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2">Sugar Level</p>
                <div className="flex gap-2">
                  {sugarLevels.map((s) => (
                    <button
                      key={s}
                      onClick={() => setCustomSugar(s)}
                      className={`flex-1 py-2.5 rounded-xl border text-[12px] transition-all text-center
                        ${customSugar === s
                          ? "border-[#EF4123] text-[#EF4123] bg-[#FEF3F0]"
                          : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2">Milk</p>
                <div className="grid grid-cols-3 gap-2">
                  {milkTypes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setCustomMilk(m)}
                      className={`py-2.5 rounded-xl border text-[11px] transition-all text-center
                        ${customMilk === m
                          ? "border-[#EF4123] text-[#EF4123] bg-[#FEF3F0]"
                          : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2">Add-ons</p>
                <div className="space-y-1.5">
                  {addOnOptions.map((ao) => {
                    const isSelected = customAddOns.includes(ao.id);
                    return (
                      <button
                        key={ao.id}
                        onClick={() =>
                          setCustomAddOns((prev) =>
                            isSelected ? prev.filter((id) => id !== ao.id) : [...prev, ao.id]
                          )
                        }
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[12px] transition-all
                          ${isSelected
                            ? "border-[#EF4123] bg-[#FEF3F0] text-[#EF4123]"
                            : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                          }`}
                      >
                        <span>{ao.name}</span>
                        <span className="text-[11px]">+{formatRupiah(ao.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[12px] text-[#6B7280] mb-2">Special Notes</p>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Extra hot, less ice..."
                  rows={2}
                  className="w-full border border-[#EBEBEB] rounded-xl px-3 py-2 text-[12px] text-[#1A1A2E] placeholder:text-[#D4D4D4] focus:outline-none focus:border-[#EF4123]/40 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={confirmCustomization}
                className="w-full py-3.5 rounded-xl bg-[#EF4123] text-white text-[13px] hover:bg-[#D93A1F] transition-colors active:scale-[0.98] shadow-sm shadow-[#EF4123]/25 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add to Order — {formatRupiah(customizationPrice)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
