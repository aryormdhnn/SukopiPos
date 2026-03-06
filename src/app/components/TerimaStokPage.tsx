import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { inventoryItems } from "./pos-data";

const suppliers = ["PT Greenfield Indonesia", "PT Toffin Indonesia", "PT Monin Indonesia", "Otten Coffee", "Other"];

export function TerimaStokPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [supplier, setSupplier] = useState(suppliers[0]);
    const [selectedItem, setSelectedItem] = useState(inventoryItems[0].id);
    const [qty, setQty] = useState("1");
    const [poRef, setPoRef] = useState("");
    const [date, setDate] = useState("2026-03-06");
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
        if (!qty || parseInt(qty) < 1) { alert("Qty must be at least 1!"); return; }
        const item = inventoryItems.find(i => i.id === selectedItem);
        alert(`Received ${qty} ${item?.uom} of "${item?.name}" from ${supplier} recorded!`);
        navigate("/inventory/movement");
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Terima Stok Baru" subtitle="Record incoming stock from suppliers" searchPlaceholder="Search..." />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/inventory/movement")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Movements
                </button>
                <div className="max-w-[700px] mx-auto">
                    <div className="bg-white rounded-2xl p-6 border border-[#EBEBEB] shadow-sm">
                        <h3 className="text-[16px] text-[#EF4123] mb-5">Incoming Stock Details</h3>
                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Supplier <span className="text-[#EF4123]">*</span></label>
                                <div className="relative">
                                    <select value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 appearance-none">
                                        {suppliers.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">PO Reference</label>
                                <input type="text" value={poRef} onChange={e => setPoRef(e.target.value)} placeholder="e.g. PO-202603-001" className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] font-mono focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20" />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="text-[13px] text-[#6B7280] mb-2 block">Item <span className="text-[#EF4123]">*</span></label>
                            <div className="relative">
                                <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 appearance-none">
                                    {inventoryItems.map(i => <option key={i.id} value={i.id}>{i.name} — {i.sku}</option>)}
                                </select>
                                <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Quantity Received <span className="text-[#EF4123]">*</span></label>
                                <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 20" className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20" />
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Received Date <span className="text-[#EF4123]">*</span></label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="text-[13px] text-[#6B7280] mb-2 block">Notes</label>
                            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Condition, remarks, etc." className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 resize-none" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate("/inventory/movement")} className="flex-[0.5] py-3.5 bg-white text-[#6B7280] text-[14px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors">Cancel</button>
                            <button onClick={handleSubmit} className="flex-1 py-3.5 bg-[#EF4123] text-white text-[14px] rounded-xl hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25">Confirm Receipt</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
