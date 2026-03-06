import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";

// Mock data
const suppliers = ["PT Greenfield Indonesia", "PT Toffin Indonesia", "PT Monin Indonesia", "Otten Coffee"];
const rawMaterials = [
    { id: "1", name: "Fresh Milk", sku: "FM-M-001", unit: "L", price: 21000 },
    { id: "2", name: "Arabica Blend Base", sku: "AB-CB-002", unit: "Kg", price: 150000 },
    { id: "3", name: "Caramel Syrup", sku: "CS-S-003", unit: "Bottle", price: 120000 },
];

interface PurchaseItem {
    id: string;
    materialId: string;
    name: string;
    sku: string;
    qty: number;
    unit: string;
    price: number;
}

export function CreatePOPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [poNumber] = useState(`PO-202603-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`);
    const [supplier, setSupplier] = useState(suppliers[0]);
    const [date, setDate] = useState("2026-03-06");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<PurchaseItem[]>([]);

    // Item selection modal state
    const [showItemModal, setShowItemModal] = useState(false);
    const [itemSearch, setItemSearch] = useState("");

    const handleCancel = () => navigate("/inventory/purchase");

    const handleSubmit = () => {
        if (items.length === 0) {
            alert("PO must contain at least one item!");
            return;
        }
        alert(`Purchase Order ${poNumber} has been successfully created!`);
        navigate("/inventory/purchase");
    };

    const addItem = (material: typeof rawMaterials[0]) => {
        if (items.find(i => i.materialId === material.id)) return; // prevent duplicate
        setItems([...items, {
            id: Date.now().toString(),
            materialId: material.id,
            name: material.name,
            sku: material.sku,
            qty: 1,
            unit: material.unit,
            price: material.price,
        }]);
        setShowItemModal(false);
    };

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

    const updateItemQty = (id: string, qty: number) => {
        if (qty < 1) return;
        setItems(items.map(i => i.id === id ? { ...i, qty } : i));
    };

    const updateItemPrice = (id: string, price: number) => {
        if (price < 0) return;
        setItems(items.map(i => i.id === id ? { ...i, price } : i));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * 0.11; // 11% PPN
    const total = subtotal + tax;

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                title="Create Purchase Order"
                subtitle="Purchase raw materials from suppliers"
                searchPlaceholder="Search..."
            />

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Purchases
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: PO Details & Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* General Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
                            <h3 className="text-[16px] text-[#EF4123] mb-5">PO Information</h3>

                            <div className="grid grid-cols-2 gap-5 mb-4">
                                <div>
                                    <label className="text-[13px] text-[#6B7280] mb-2 block">PO Number</label>
                                    <input type="text" value={poNumber} disabled className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#9CA3AF] cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="text-[13px] text-[#6B7280] mb-2 block">Date</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Supplier</label>
                                <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]">
                                    {suppliers.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Notes</label>
                                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery instructions or internal notes..." className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] resize-none" />
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[16px] text-[#EF4123]">Purchase Items</h3>
                                <button onClick={() => setShowItemModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#FEF3F0] text-[#EF4123] rounded-xl text-[12px] hover:bg-[#FCE6E1] transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Material
                                </button>
                            </div>

                            {items.length > 0 ? (
                                <div className="border border-[#EBEBEB] rounded-xl overflow-hidden">
                                    <table className="w-full text-[13px]">
                                        <thead>
                                            <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#9CA3AF]">
                                                <th className="text-left font-normal px-4 py-3">Item</th>
                                                <th className="text-right font-normal px-4 py-3 w-24">Qty</th>
                                                <th className="text-right font-normal px-4 py-3">Unit Price (Rp)</th>
                                                <th className="text-right font-normal px-4 py-3">Total (Rp)</th>
                                                <th className="w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map(item => (
                                                <tr key={item.id} className="border-b border-[#F5F5F5] last:border-none">
                                                    <td className="px-4 py-3">
                                                        <p className="text-[#1A1A2E]">{item.name}</p>
                                                        <p className="text-[10px] text-[#9CA3AF] font-mono">{item.sku}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <input type="number" value={item.qty} onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 1)} className="w-14 px-2 py-1 text-right border border-[#EBEBEB] rounded focus:outline-none focus:border-[#EF4123]" />
                                                            <span className="text-[11px] text-[#9CA3AF] w-6">{item.unit}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input type="number" value={item.price} onChange={(e) => updateItemPrice(item.id, parseInt(e.target.value) || 0)} className="w-24 px-2 py-1 text-right border border-[#EBEBEB] rounded focus:outline-none focus:border-[#EF4123]" />
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-[#1A1A2E]">
                                                        {(item.qty * item.price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button onClick={() => removeItem(item.id)} className="text-[#EF4123] hover:bg-[#FEF3F0] p-1.5 rounded transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-[#EBEBEB] rounded-xl bg-[#FAFAFA]">
                                    <p className="text-[13px] text-[#9CA3AF] mb-3">No items added to this PO yet</p>
                                    <button onClick={() => setShowItemModal(true)} className="flex items-center gap-1.5 px-4 py-2 border border-[#EBEBEB] bg-white text-[#1A1A2E] rounded-xl text-[12px] hover:bg-[#F5F5F5] transition-colors shadow-sm">
                                        <Search className="w-3.5 h-3.5" /> Browse Materials
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Review & Total */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB]">
                            <h3 className="text-[16px] text-[#1A1A2E] mb-5">Order Summary</h3>

                            <div className="space-y-3 mb-5 border-b border-[#F0F0F0] pb-5 text-[13px]">
                                <div className="flex justify-between text-[#6B7280]">
                                    <span>Items Subtotal ({items.length})</span>
                                    <span className="text-[#1A1A2E]">Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-[#6B7280]">
                                    <span>Tax (PPN 11%)</span>
                                    <span className="text-[#1A1A2E]">Rp {tax.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-[#6B7280]">
                                    <span>Shipping</span>
                                    <span className="text-[#1A1A2E]">Rp 0</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <span className="text-[14px] text-[#1A1A2E] font-medium">Total Price</span>
                                <span className="text-[20px] text-[#EF4123] font-semibold">Rp {total.toLocaleString('id-ID')}</span>
                            </div>

                            <div className="space-y-3">
                                <button onClick={handleSubmit} className="w-full py-3.5 bg-[#EF4123] text-white text-[14px] rounded-xl hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25">
                                    Confirm PO
                                </button>
                                <button onClick={handleCancel} className="w-full py-3.5 bg-white text-[#6B7280] text-[14px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors">
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item Selection Modal */}
            {showItemModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-[#EBEBEB]">
                            <h3 className="text-[16px] text-[#1A1A2E] mb-3">Add Material to PO</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} placeholder="Search material name or SKU..." className="w-full pl-9 pr-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-[#EF4123]" />
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2">
                            {rawMaterials.filter(m => m.name.toLowerCase().includes(itemSearch.toLowerCase()) || m.sku.toLowerCase().includes(itemSearch.toLowerCase())).map(material => (
                                <div key={material.id} className="flex items-center justify-between p-3 hover:bg-[#FAFAFA] rounded-xl transition-colors">
                                    <div>
                                        <p className="text-[13px] text-[#1A1A2E]">{material.name}</p>
                                        <p className="text-[11px] text-[#9CA3AF] font-mono">{material.sku} • Rp {material.price.toLocaleString('id-ID')} / {material.unit}</p>
                                    </div>
                                    <button onClick={() => addItem(material)} className="px-3 py-1.5 bg-[#FEF3F0] text-[#EF4123] text-[11px] rounded-lg hover:bg-[#FCE6E1] transition-colors">
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-[#EBEBEB] text-right">
                            <button onClick={() => setShowItemModal(false)} className="px-5 py-2 bg-white text-[#6B7280] text-[13px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
