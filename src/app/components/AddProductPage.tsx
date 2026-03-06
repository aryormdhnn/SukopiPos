import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { categories, subCategories, type Category, type SubCategory } from "./pos-data";
import { ArrowLeft, Upload, X, Plus, ArrowLeftRight, Trash2, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ─── Ingredient Type ─────────────────────────────────────────────────────────
interface Ingredient {
  id: string;
  name: string;
  sku: string;
  usage: string;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function AddProductPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Form State ────────────────────────────────────────────────────────────
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<Category>("Coffee");
  const [subCategory, setSubCategory] = useState<SubCategory>("Latte");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState(true);
  const [description, setDescription] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // ─── Ingredients State ─────────────────────────────────────────────────────
  const [drinkType, setDrinkType] = useState("Cold");
  const [drinkSize, setDrinkSize] = useState("Small");
  const [defaultIngredients, setDefaultIngredients] = useState<Ingredient[]>([]);
  const [extraIngredients, setExtraIngredients] = useState<Ingredient[]>([]);
  const [extraEnabled, setExtraEnabled] = useState(true);

  // New ingredient form
  const [showAddDefault, setShowAddDefault] = useState(false);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [newIngName, setNewIngName] = useState("");
  const [newIngSku, setNewIngSku] = useState("");
  const [newIngUsage, setNewIngUsage] = useState("");

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDefaultIngredient = () => {
    if (newIngName && newIngSku && newIngUsage) {
      setDefaultIngredients([
        ...defaultIngredients,
        { id: Date.now().toString(), name: newIngName, sku: newIngSku, usage: newIngUsage },
      ]);
      setNewIngName("");
      setNewIngSku("");
      setNewIngUsage("");
      setShowAddDefault(false);
    }
  };

  const handleAddExtraIngredient = () => {
    if (newIngName && newIngSku && newIngUsage) {
      setExtraIngredients([
        ...extraIngredients,
        { id: Date.now().toString(), name: newIngName, sku: newIngSku, usage: newIngUsage },
      ]);
      setNewIngName("");
      setNewIngSku("");
      setNewIngUsage("");
      setShowAddExtra(false);
    }
  };

  const removeDefaultIngredient = (id: string) => {
    setDefaultIngredients(defaultIngredients.filter((ing) => ing.id !== id));
  };

  const removeExtraIngredient = (id: string) => {
    setExtraIngredients(extraIngredients.filter((ing) => ing.id !== id));
  };

  const handleSubmit = () => {
    // Validation
    if (!productName || !sku || !price || !stock) {
      alert("Silakan lengkapi semua field yang wajib diisi!");
      return;
    }

    // Create product object (in real app, this would be sent to API)
    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      category,
      subCategory,
      sku,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      discount: discount ? parseFloat(discount) : undefined,
      stock: parseInt(stock),
      status,
      description,
      isNew,
      isBestSeller,
      image: imagePreview || imageUrl || "https://images.unsplash.com/photo-1615400924742-67293aae4257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmluayUyMHByb2R1Y3QlMjBwbGFjZWhvbGRlcnxlbnwxfHx8fDE3NzI3NTc3MzF8MA&ixlib=rb-4.1.0&q=80&w=400",
    };

    console.log("New Product:", newProduct);
    console.log("Default Ingredients:", defaultIngredients);
    console.log("Extra Ingredients:", extraIngredients);

    // Show success message
    alert(`Product "${productName}" berhasil ditambahkan!`);
    
    // Navigate back to menu page
    navigate("/menu");
  };

  const handleCancel = () => {
    navigate("/menu");
  };

  // Auto-generate SKU from category and name
  const generateSku = () => {
    const catCode = category.substring(0, 2).toUpperCase();
    const nameCode = productName.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    setSku(`${nameCode}-${catCode}-${random}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title="Add New Product"
        subtitle="Create a new menu item"
        searchPlaceholder="Search..."
      />
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product List
        </button>

        <div className="max-w-[1200px] mx-auto">
          {/* Form Container */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
            {/* Section 1: Product Image */}
            <div className="mb-6">
              <h3 className="text-[16px] text-[#EF4123] mb-4">Product Image</h3>
              <div className="flex gap-6 items-start">
                {/* Image Preview */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[240px] h-[240px] rounded-xl border-2 border-dashed border-[#EBEBEB] bg-[#FAFAFA] flex flex-col items-center justify-center cursor-pointer hover:border-[#EF4123] hover:bg-[#FEF3F0] transition-all overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-[#C4C4C4] mb-2" />
                      <span className="text-[13px] text-[#9CA3AF]">Click to upload</span>
                      <span className="text-[11px] text-[#C4C4C4] mt-1">PNG, JPG up to 5MB</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Image URL Alternative */}
                <div className="flex-1">
                  <label className="text-[13px] text-[#6B7280] mb-2 block">Or enter image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                  />
                  {imagePreview && (
                    <button
                      onClick={() => {
                        setImagePreview("");
                        setImageUrl("");
                      }}
                      className="mt-2 text-[12px] text-[#EF4123] hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F0F0F0] my-6" />

            {/* Section 2: Basic Information */}
            <div className="mb-6">
              <h3 className="text-[16px] text-[#EF4123] mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="col-span-2">
                  <label className="text-[13px] text-[#6B7280] mb-2 block">
                    Product Name <span className="text-[#EF4123]">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Caffe Latte"
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">
                    Category <span className="text-[#EF4123]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] appearance-none cursor-pointer"
                    >
                      {categories.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Sub Category */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">
                    Sub Category <span className="text-[#EF4123]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value as SubCategory)}
                      className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] appearance-none cursor-pointer"
                    >
                      {subCategories.filter((s) => s !== "All").map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">
                    SKU <span className="text-[#EF4123]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. CL-CF-001"
                      className="flex-1 px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] font-mono placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                    />
                    <button
                      onClick={generateSku}
                      className="px-4 py-2.5 bg-[#EF4123] text-white text-[12px] rounded-xl hover:bg-[#D93A1F] transition-colors whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-[13px] text-[#6B7280] mb-2 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the product..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F0F0F0] my-6" />

            {/* Section 3: Pricing & Stock */}
            <div className="mb-6">
              <h3 className="text-[16px] text-[#EF4123] mb-4">Pricing & Stock</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">
                    Price (Rp) <span className="text-[#EF4123]">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="32000"
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">
                    Stock <span className="text-[#EF4123]">*</span>
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                  />
                </div>

                {/* Old Price */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">Old Price (Rp)</label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="text-[13px] text-[#6B7280] mb-2 block">Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Optional"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F0F0F0] my-6" />

            {/* Section 4: Product Settings */}
            <div className="mb-6">
              <h3 className="text-[16px] text-[#EF4123] mb-4">Product Settings</h3>
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl border border-[#EBEBEB]">
                  <div>
                    <p className="text-[13px] text-[#1A1A2E]">Active Status</p>
                    <p className="text-[11px] text-[#9CA3AF]">Product will be visible in menu</p>
                  </div>
                  <button
                    onClick={() => setStatus(!status)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      status ? "bg-[#EF4123]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        status ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setIsNew(!isNew)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      isNew
                        ? "border-[#EF4123] bg-[#FEF3F0]"
                        : "border-[#EBEBEB] bg-[#FAFAFA] hover:border-[#EF4123]/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        isNew ? "bg-[#EF4123]" : "border border-[#D4D4D4]"
                      }`}
                    >
                      {isNew && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] text-[#1A1A2E]">New Product</p>
                      <p className="text-[11px] text-[#9CA3AF]">Show "New" badge</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsBestSeller(!isBestSeller)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      isBestSeller
                        ? "border-[#EF4123] bg-[#FEF3F0]"
                        : "border-[#EBEBEB] bg-[#FAFAFA] hover:border-[#EF4123]/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        isBestSeller ? "bg-[#EF4123]" : "border border-[#D4D4D4]"
                      }`}
                    >
                      {isBestSeller && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] text-[#1A1A2E]">Best Seller</p>
                      <p className="text-[11px] text-[#9CA3AF]">Show "Best" badge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F0F0F0] my-6" />

            {/* Section 5: Ingredients */}
            <div className="mb-6">
              <h3 className="text-[16px] text-[#EF4123] mb-4">Ingredients</h3>

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

              {/* Ingredients Tables */}
              <div className="grid grid-cols-2 gap-4">
                {/* Default Ingredients */}
                <div className="border border-[#EBEBEB] rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#EBEBEB] flex items-center justify-between">
                    <span className="text-[13px] text-[#1A1A2E]">Default</span>
                    <button
                      onClick={() => setShowAddDefault(!showAddDefault)}
                      className="text-[#EF4123] hover:bg-[#FEF3F0] p-1 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Ingredient Form */}
                  {showAddDefault && (
                    <div className="p-3 bg-[#FEF3F0] border-b border-[#EBEBEB] space-y-2">
                      <input
                        type="text"
                        value={newIngName}
                        onChange={(e) => setNewIngName(e.target.value)}
                        placeholder="Ingredient name"
                        className="w-full px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#EF4123]"
                      />
                      <input
                        type="text"
                        value={newIngSku}
                        onChange={(e) => setNewIngSku(e.target.value)}
                        placeholder="SKU"
                        className="w-full px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-[#EF4123]"
                      />
                      <input
                        type="text"
                        value={newIngUsage}
                        onChange={(e) => setNewIngUsage(e.target.value)}
                        placeholder="Usage (e.g. 100ml)"
                        className="w-full px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#EF4123]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddDefaultIngredient}
                          className="flex-1 px-3 py-1.5 bg-[#EF4123] text-white text-[11px] rounded-lg hover:bg-[#D93A1F] transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddDefault(false);
                            setNewIngName("");
                            setNewIngSku("");
                            setNewIngUsage("");
                          }}
                          className="flex-1 px-3 py-1.5 bg-white text-[#6B7280] text-[11px] rounded-lg hover:bg-[#F5F5F5] transition-colors border border-[#EBEBEB]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ingredients List */}
                  {defaultIngredients.length > 0 ? (
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="text-[#EF4123]">
                          <th className="text-left px-4 py-2.5">Stock</th>
                          <th className="text-left px-4 py-2.5">SKU</th>
                          <th className="text-left px-4 py-2.5">Usage</th>
                          <th className="w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {defaultIngredients.map((ing) => (
                          <tr key={ing.id} className="border-t border-[#F5F5F5]">
                            <td className="px-4 py-2.5 text-[#1A1A2E]">
                              <div className="flex items-center gap-2">
                                {ing.name}
                                <ArrowLeftRight className="w-3.5 h-3.5 text-[#C4C4C4]" />
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-[#9CA3AF] font-mono text-[11px]">{ing.sku}</td>
                            <td className="px-4 py-2.5 text-[#6B7280]">{ing.usage}</td>
                            <td className="px-2 py-2.5">
                              <button
                                onClick={() => removeDefaultIngredient(ing.id)}
                                className="text-[#EF4123] hover:bg-[#FEF3F0] p-1 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="px-4 py-6 text-center text-[12px] text-[#C4C4C4]">
                      No ingredients added yet
                    </div>
                  )}
                </div>

                {/* Extra Option Ingredients */}
                <div className="border border-[#EBEBEB] rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#EBEBEB] flex items-center gap-2">
                    <button
                      onClick={() => setExtraEnabled(!extraEnabled)}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        extraEnabled ? "bg-[#EF4123]" : "border border-[#D4D4D4]"
                      }`}
                    >
                      {extraEnabled && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span className="text-[13px] text-[#1A1A2E] flex-1">Extra Option</span>
                    {extraEnabled && (
                      <button
                        onClick={() => setShowAddExtra(!showAddExtra)}
                        className="text-[#EF4123] hover:bg-[#FEF3F0] p-1 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {extraEnabled && (
                    <>
                      {/* Add Ingredient Form */}
                      {showAddExtra && (
                        <div className="p-3 bg-[#FEF3F0] border-b border-[#EBEBEB] space-y-2">
                          <input
                            type="text"
                            value={newIngName}
                            onChange={(e) => setNewIngName(e.target.value)}
                            placeholder="Ingredient name"
                            className="w-full px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#EF4123]"
                          />
                          <input
                            type="text"
                            value={newIngSku}
                            onChange={(e) => setNewIngSku(e.target.value)}
                            placeholder="SKU"
                            className="w-full px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-[#EF4123]"
                          />
                          <input
                            type="text"
                            value={newIngUsage}
                            onChange={(e) => setNewIngUsage(e.target.value)}
                            placeholder="Usage (e.g. 100ml)"
                            className="w-full px-3 py-1.5 bg-white border border-[#EBEBEB] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#EF4123]"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddExtraIngredient}
                              className="flex-1 px-3 py-1.5 bg-[#EF4123] text-white text-[11px] rounded-lg hover:bg-[#D93A1F] transition-colors"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setShowAddExtra(false);
                                setNewIngName("");
                                setNewIngSku("");
                                setNewIngUsage("");
                              }}
                              className="flex-1 px-3 py-1.5 bg-white text-[#6B7280] text-[11px] rounded-lg hover:bg-[#F5F5F5] transition-colors border border-[#EBEBEB]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Ingredients List */}
                      {extraIngredients.length > 0 ? (
                        <table className="w-full text-[12px]">
                          <thead>
                            <tr className="bg-[#EF4123] text-white">
                              <th className="text-left px-4 py-2.5">Stock</th>
                              <th className="text-left px-4 py-2.5">SKU</th>
                              <th className="text-left px-4 py-2.5">Usage</th>
                              <th className="w-8"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {extraIngredients.map((ing) => (
                              <tr key={ing.id} className="border-t border-[#F5F5F5]">
                                <td className="px-4 py-2.5 text-[#1A1A2E]">
                                  <div className="flex items-center gap-2">
                                    {ing.name}
                                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#C4C4C4]" />
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 text-[#9CA3AF] font-mono text-[11px]">{ing.sku}</td>
                                <td className="px-4 py-2.5 text-[#6B7280]">{ing.usage}</td>
                                <td className="px-2 py-2.5">
                                  <button
                                    onClick={() => removeExtraIngredient(ing.id)}
                                    className="text-[#EF4123] hover:bg-[#FEF3F0] p-1 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="px-4 py-6 text-center text-[12px] text-[#C4C4C4]">
                          No extra ingredients added yet
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCancel}
                className="flex-1 py-3.5 bg-white text-[#6B7280] text-[14px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3.5 bg-[#EF4123] text-white text-[14px] rounded-xl hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}