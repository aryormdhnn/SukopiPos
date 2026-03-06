import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, ChevronDown, Trash2 } from "lucide-react";
import { products, categories } from "./pos-data";

export function EditProductPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("id");
    const existingProduct = products.find(p => p.id === productId) || products[0];

    const [searchQuery, setSearchQuery] = useState("");
    const [name, setName] = useState(existingProduct.name);
    const [price, setPrice] = useState(String(existingProduct.price));
    const [category, setCategory] = useState(existingProduct.category);
    const [sku, setSku] = useState(existingProduct.sku);
    const [status, setStatus] = useState(existingProduct.status);
    const [description, setDescription] = useState(existingProduct.description || "");
    const [discount, setDiscount] = useState(String(existingProduct.discount || ""));
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = () => {
        if (!name || !price) { alert("Please fill in required fields!"); return; }
        alert(`Product "${name}" has been updated!`);
        navigate("/menu");
    };

    const handleDelete = () => {
        alert(`Product "${existingProduct.name}" has been deleted!`);
        navigate("/menu");
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Edit Product" subtitle={`Editing: ${existingProduct.name}`} searchPlaceholder="Search..." />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/menu")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Menu
                </button>
                <div className="max-w-[700px] mx-auto space-y-5">
                    {/* Info Card */}
                    <div className="bg-white rounded-2xl p-6 border border-[#EBEBEB] shadow-sm">
                        <h3 className="text-[16px] text-[#EF4123] mb-5">Product Details</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Product Name <span className="text-[#EF4123]">*</span></label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]" />
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Price (Rp) <span className="text-[#EF4123]">*</span></label>
                                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]" />
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Discount (%)</label>
                                <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="e.g. 10" className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]" />
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Category</label>
                                <div className="relative">
                                    <select value={category} onChange={e => setCategory(e.target.value as typeof category)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 appearance-none">
                                        {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">SKU</label>
                                <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] font-mono focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Description</label>
                                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] resize-none" />
                            </div>
                            <div className="col-span-2 flex items-center gap-3">
                                <label className="text-[13px] text-[#6B7280]">Status</label>
                                <button onClick={() => setStatus(!status)} className={`relative w-12 h-6 rounded-full transition-colors ${status ? "bg-green-500" : "bg-[#E5E7EB]"}`}>
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${status ? "left-6" : "left-0.5"}`} />
                                </button>
                                <span className={`text-[12px] ${status ? "text-green-600" : "text-[#9CA3AF]"}`}>{status ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-5 py-3.5 bg-white border border-red-200 text-[#EF4123] text-[13px] rounded-xl hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" /> Delete Product
                        </button>
                        <button onClick={() => navigate("/menu")} className="flex-[0.5] py-3.5 bg-white text-[#6B7280] text-[13px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors">Cancel</button>
                        <button onClick={handleSave} className="flex-1 py-3.5 bg-[#EF4123] text-white text-[13px] rounded-xl hover:bg-[#D93A1F] shadow-sm shadow-[#EF4123]/25 transition-colors">Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[360px] shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-[#EF4123]" />
                        </div>
                        <h3 className="text-[16px] text-[#1A1A2E] text-center mb-1">Delete Product?</h3>
                        <p className="text-[12px] text-[#9CA3AF] text-center mb-5">"{existingProduct.name}" will be permanently deleted from the menu.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-[#F5F5F5] text-[#6B7280] rounded-xl text-[13px] hover:bg-[#EBEBEB] transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3 bg-[#EF4123] text-white rounded-xl text-[13px] hover:bg-[#D93A1F] transition-colors shadow-sm">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
