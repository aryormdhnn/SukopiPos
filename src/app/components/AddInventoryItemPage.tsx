import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, ChevronDown } from "lucide-react";

export function AddInventoryItemPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("Coffee Beans");
    const [sku, setSku] = useState("");
    const [uom, setUom] = useState("Kg");
    const [conversion, setConversion] = useState("");
    const [minStock, setMinStock] = useState("");
    const [initialSoh, setInitialSoh] = useState("");

    const categories = ["Coffee Beans", "Dairy & Alt", "Syrup & Sauce", "Powder & Tea", "Packaging", "Pastry Base"];
    const uoms = ["Kg", "Gr", "L", "Ml", "Pcs", "Box", "Pack"];

    const handleCancel = () => navigate("/inventory");

    const handleSubmit = () => {
        if (!itemName || !sku || !minStock || !initialSoh) {
            alert("Silakan lengkapi field yang wajib diisi!");
            return;
        }
        alert(`Item "${itemName}" berhasil ditambahkan ke Inventory!`);
        navigate("/inventory");
    };

    const generateSku = () => {
        const catCode = category.substring(0, 2).toUpperCase();
        const nameCode = itemName.substring(0, 3).toUpperCase();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        setSku(`INV-${catCode}-${nameCode}-${random}`);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                title="Add Inventory Item"
                subtitle="Register a new raw material or supply"
                searchPlaceholder="Search..."
            />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Inventory
                </button>

                <div className="max-w-[800px] mx-auto">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
                        <h3 className="text-[16px] text-[#EF4123] mb-5">Item Details</h3>

                        <div className="grid grid-cols-2 gap-5 mb-6">
                            {/* Item Name */}
                            <div className="col-span-2">
                                <label className="text-[13px] text-[#6B7280] mb-2 block">
                                    Item Name <span className="text-[#EF4123]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="e.g. Arabica Brazil Natural"
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
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] appearance-none cursor-pointer"
                                    >
                                        {categories.map((cat) => <option key={cat}>{cat}</option>)}
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
                                        placeholder="e.g. INV-CB-ARA-001"
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
                        </div>

                        <div className="border-t border-[#F0F0F0] my-6" />
                        <h3 className="text-[16px] text-[#EF4123] mb-5">Measurement & Thresholds</h3>

                        <div className="grid grid-cols-2 gap-5 mb-2">
                            {/* UOM */}
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">
                                    Unit of Measure (Base Unit) <span className="text-[#EF4123]">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={uom}
                                        onChange={(e) => setUom(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] appearance-none cursor-pointer"
                                    >
                                        {uoms.map((u) => <option key={u}>{u}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            {/* Conversion */}
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">
                                    Conversion (e.g. 1 Box = 12 Pack)
                                </label>
                                <input
                                    type="text"
                                    value={conversion}
                                    onChange={(e) => setConversion(e.target.value)}
                                    placeholder="Optional"
                                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                                />
                            </div>

                            {/* Min Stock */}
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">
                                    Minimum Stock Warning <span className="text-[#EF4123]">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={minStock}
                                    onChange={(e) => setMinStock(e.target.value)}
                                    placeholder="e.g. 5"
                                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                                />
                            </div>

                            {/* Initial SOH */}
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">
                                    Initial Stock on Hand <span className="text-[#EF4123]">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={initialSoh}
                                    onChange={(e) => setInitialSoh(e.target.value)}
                                    placeholder="e.g. 20"
                                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleCancel}
                                className="flex-[0.5] py-3.5 bg-white text-[#6B7280] text-[14px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-3.5 bg-[#EF4123] text-white text-[14px] rounded-xl hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25"
                            >
                                Add Inventory Item
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
