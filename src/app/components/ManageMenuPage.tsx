import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { products, formatRupiah, type Product } from "./pos-data";
import { Plus, Trash2, MoreVertical, X, Edit3, Eye, Copy, Star, Download, ArrowLeftRight, ChevronDown, CheckSquare } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ─── Mock ingredient data per product ────────────────────────────────────────
interface Ingredient {
  name: string;
  sku: string;
  usage: string;
}

const defaultIngredientsMap: Record<string, Ingredient[]> = {
  Coffee: [
    { name: "Fresh Milk", sku: "FM-M-001", usage: "100ml" },
    { name: "Espresso", sku: "E-C-076", usage: "50ml" },
  ],
  "Non Coffee": [
    { name: "Fresh Milk", sku: "FM-M-001", usage: "150ml" },
    { name: "Sweetener", sku: "SW-S-004", usage: "20ml" },
  ],
  Tea: [
    { name: "Tea Leaves", sku: "TL-T-010", usage: "5gr" },
    { name: "Hot Water", sku: "HW-W-001", usage: "200ml" },
    { name: "Honey", sku: "HNY-SW-004", usage: "15ml" },
  ],
  Pastries: [
    { name: "Flour", sku: "FL-P-001", usage: "200gr" },
    { name: "Butter", sku: "BT-P-002", usage: "50gr" },
    { name: "Sugar", sku: "SG-P-003", usage: "30gr" },
  ],
  Snacks: [
    { name: "Flour", sku: "FL-P-001", usage: "150gr" },
    { name: "Chocolate Chips", sku: "CC-S-005", usage: "40gr" },
  ],
};

const extraOptionsMap: Record<string, Ingredient[]> = {
  Coffee: [
    { name: "Macadamia", sku: "M-S-003", usage: "20ml" },
    { name: "Espresso", sku: "E-C-076", usage: "20ml" },
    { name: "Oreo Crumble", sku: "O-TP-001", usage: "20gr" },
  ],
  "Non Coffee": [
    { name: "Whipped Cream", sku: "WC-TP-012", usage: "30ml" },
    { name: "Chocolate Sauce", sku: "CS-SC-010", usage: "15ml" },
  ],
  Tea: [
    { name: "Lemon Slice", sku: "LS-F-001", usage: "2pcs" },
    { name: "Honey Extra", sku: "HNY-SW-004", usage: "10ml" },
  ],
  Pastries: [
    { name: "Cream Cheese", sku: "CC-DC-001", usage: "30gr" },
    { name: "Cinnamon", sku: "CN-SP-001", usage: "5gr" },
  ],
  Snacks: [
    { name: "Vanilla Extract", sku: "VE-FL-001", usage: "5ml" },
  ],
};

// ─── Dropdown Menu Component ─────────────────────────────────────────────────
function MoreMenu({
  product,
  onViewDetails,
  onDuplicate,
  onDelete,
  onEdit,
}: {
  product: Product;
  onViewDetails: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="w-8 h-8 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-[#C4C4C4]" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 w-44 bg-white rounded-xl border border-[#EBEBEB] shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onViewDetails(); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-[#1A1A2E] hover:bg-[#FAFAFA] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#9CA3AF]" /> View Details
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-[#1A1A2E] hover:bg-[#FAFAFA] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#9CA3AF]" /> Edit Product
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDuplicate(); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-[#1A1A2E] hover:bg-[#FAFAFA] transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" /> Duplicate
          </button>
          <div className="border-t border-[#F0F0F0] my-1" />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-[#EF4123] hover:bg-[#FEF3F0] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Product Detail Modal ────────────────────────────────────────────────────
function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [drinkType, setDrinkType] = useState("Cold");
  const [drinkSize, setDrinkSize] = useState("Small");
  const [extraEnabled, setExtraEnabled] = useState(true);

  const defaultIngredients = defaultIngredientsMap[product.category] || defaultIngredientsMap.Coffee;
  const extraOptions = extraOptionsMap[product.category] || extraOptionsMap.Coffee;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] text-[#EF4123]">Product Details</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          {/* Product Info — Image + Table */}
          <div className="flex gap-5 mb-6">
            <div className="w-[200px] h-[200px] rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <table className="w-full text-[13px]">
                <tbody>
                  {[
                    ["Name", product.name],
                    ["Category", product.category],
                    ["Sub Category", product.subCategory],
                    ["SKU", product.sku],
                    ["Price", formatRupiah(product.price).replace("Rp ", "")],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-[#F0F0F0]">
                      <td className="py-3 text-[#6B7280] w-[140px]">{label}</td>
                      <td className="py-3 text-[#1A1A2E] text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ingredients Header */}
          <h3 className="text-[18px] text-[#EF4123] mb-4">Ingredients</h3>

          {/* Type & Size Selectors */}
          <div className="flex items-center gap-4 mb-4">
            {/* Type */}
            <div className="flex items-center border border-[#EBEBEB] rounded-full overflow-hidden">
              <span className="px-4 py-2 bg-[#EF4123] text-white text-[12px]">Type</span>
              <div className="relative">
                <select
                  value={drinkType}
                  onChange={(e) => setDrinkType(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 text-[12px] text-[#1A1A2E] bg-white focus:outline-none cursor-pointer"
                >
                  <option>Cold</option>
                  <option>Hot</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            {/* Size */}
            <div className="flex items-center border border-[#EBEBEB] rounded-full overflow-hidden">
              <span className="px-4 py-2 bg-[#EF4123] text-white text-[12px]">Size</span>
              <div className="relative">
                <select
                  value={drinkSize}
                  onChange={(e) => setDrinkSize(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 text-[12px] text-[#1A1A2E] bg-white focus:outline-none cursor-pointer"
                >
                  <option>Small</option>
                  <option>Regular</option>
                  <option>Large</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Ingredients Tables — Default + Extra */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Default Table */}
            <div className="border border-[#EBEBEB] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#EBEBEB]">
                <span className="text-[13px] text-[#1A1A2E]">Default</span>
              </div>
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-[#EF4123]">
                    <th className="text-left px-4 py-2.5">Stock</th>
                    <th className="text-left px-4 py-2.5">SKU</th>
                    <th className="text-left px-4 py-2.5">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultIngredients.map((ing) => (
                    <tr key={ing.sku} className="border-t border-[#F5F5F5]">
                      <td className="px-4 py-2.5 text-[#1A1A2E]">
                        <div className="flex items-center gap-2">
                          {ing.name}
                          <ArrowLeftRight className="w-3.5 h-3.5 text-[#C4C4C4]" />
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[#9CA3AF] font-mono text-[11px]">{ing.sku}</td>
                      <td className="px-4 py-2.5 text-[#6B7280]">{ing.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Extra Option Table */}
            <div className="border border-[#EBEBEB] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#EBEBEB] flex items-center gap-2">
                <button
                  onClick={() => setExtraEnabled(!extraEnabled)}
                  className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${extraEnabled ? "bg-[#EF4123]" : "border border-[#D4D4D4]"
                    }`}
                >
                  {extraEnabled && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-[13px] text-[#1A1A2E]">Extra Option</span>
              </div>
              {extraEnabled && (
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-[#EF4123] text-white">
                      <th className="text-left px-4 py-2.5">Stock</th>
                      <th className="text-left px-4 py-2.5">SKU</th>
                      <th className="text-left px-4 py-2.5">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extraOptions.map((ing) => (
                      <tr key={ing.sku} className="border-t border-[#F5F5F5]">
                        <td className="px-4 py-2.5 text-[#1A1A2E]">
                          <div className="flex items-center gap-2">
                            {ing.name}
                            <ArrowLeftRight className="w-3.5 h-3.5 text-[#C4C4C4]" />
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[#9CA3AF] font-mono text-[11px]">{ing.sku}</td>
                        <td className="px-4 py-2.5 text-[#6B7280]">{ing.usage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button className="w-full py-3.5 bg-[#EF4123] text-white text-[14px] rounded-xl hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function ManageMenuPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((p) => [p.id, p.status]))
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const filtered = products
    .filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      if (sortBy === "Price (Low)") return a.price - b.price;
      if (sortBy === "Price (High)") return b.price - a.price;
      if (sortBy === "Stock (Low)") return a.stock - b.stock;
      return 0;
    });

  const toggleStatus = (id: string) => setStatusMap((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCheck = (id: string) => setCheckedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => {
    if (checkedIds.size === filtered.length) setCheckedIds(new Set());
    else setCheckedIds(new Set(filtered.map((p) => p.id)));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Product" subtitle="Manage your menu catalog" searchPlaceholder="Search product..." />
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
              <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]">
                <option>All</option><option>Coffee</option><option>Non Coffee</option><option>Tea</option><option>Pastries</option><option>Snacks</option>
              </select>
            </div>
            <div className="flex items-center bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
              <span className="px-3 py-2 text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">Sort</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[12px] px-3 py-2 border-none focus:outline-none bg-white text-[#1A1A2E]">
                <option>Name</option><option>Price (Low)</option><option>Price (High)</option><option>Stock (Low)</option>
              </select>
            </div>
            <span className="text-[12px] text-[#C4C4C4]">{filtered.length} products</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[12px] hover:bg-[#FAFAFA]">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => navigate("/menu/add")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#EF4123] text-white rounded-xl text-[12px] hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] text-[#C4C4C4] bg-[#FAFAFA]">
                <th className="text-left px-4 py-3 w-10">
                  <input type="checkbox" checked={checkedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded accent-[#EF4123]" />
                </th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={checkedIds.has(product.id)} onChange={() => toggleCheck(product.id)} className="rounded accent-[#EF4123]" />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedProduct(product)} className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0">
                        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-[#1A1A2E]">{product.name}</span>
                          {product.isBestSeller && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          {product.isNew && <span className="px-1.5 py-0.5 bg-[#EF4123] text-white text-[8px] rounded">NEW</span>}
                        </div>
                        <span className="text-[10px] text-[#C4C4C4]">{product.subCategory}</span>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#9CA3AF]">{product.category}</td>
                  <td className="px-4 py-3 text-[12px] text-[#9CA3AF] font-mono">{product.sku}</td>
                  <td className="px-4 py-3 text-[12px]">
                    <span className={product.stock === 0 ? "text-[#EF4123]" : product.stock < 20 ? "text-amber-500" : "text-[#1A1A2E]"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#1A1A2E]">
                    {formatRupiah(product.price)}
                    {product.discount && <span className="ml-1 text-[10px] text-[#EF4123]">-{product.discount}%</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStatus(product.id); }}
                      className={`relative w-10 h-[22px] rounded-full transition-all ${statusMap[product.id] ? "bg-green-500" : "bg-[#D4D4D4]"}`}
                    >
                      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${statusMap[product.id] ? "left-[22px]" : "left-[3px]"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <MoreMenu
                      product={product}
                      onViewDetails={() => setSelectedProduct(product)}
                      onDuplicate={() => { }}
                      onDelete={() => { }}
                      onEdit={() => navigate(`/menu/edit?id=${product.id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {checkedIds.size > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-[#FEF3F0] border-t border-[#EF4123]/10">
              <span className="text-[12px] text-[#EF4123]">{checkedIds.size} selected</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#6B7280] hover:text-[#EF4123]">
                  <Copy className="w-3 h-3" /> Duplicate
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#EF4123] hover:text-red-600">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]">
            <p className="text-[11px] text-[#C4C4C4]">{filtered.length} products total</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button key={page} className={`w-8 h-8 rounded-lg text-[12px] transition-all ${page === 1 ? "bg-[#EF4123] text-white" : "text-[#9CA3AF] hover:bg-[#F5F5F5]"}`}>
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}