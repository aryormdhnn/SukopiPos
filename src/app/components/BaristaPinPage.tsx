import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { baristas } from "./pos-data";

const avatarColors = [
    "from-orange-400 to-red-400",
    "from-pink-400 to-rose-400",
    "from-violet-400 to-purple-400",
    "from-teal-400 to-cyan-400",
    "from-blue-400 to-indigo-400",
];

const initials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

export function BaristaPinPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBarista, setSelectedBarista] = useState(baristas[0]);
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [saved, setSaved] = useState("");

    const handleSave = () => {
        if (newPin.length !== 4) { alert("PIN must be 4 digits!"); return; }
        if (newPin !== confirmPin) { alert("PINs do not match!"); return; }
        setSaved(selectedBarista.id);
        setNewPin("");
        setConfirmPin("");
        setTimeout(() => setSaved(""), 2000);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Atur PIN" subtitle="Set or reset barista login PINs" searchPlaceholder="Search barista..." />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/barista")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Barista
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[800px] mx-auto">
                    {/* Barista List */}
                    <div className="space-y-2">
                        <p className="text-[12px] text-[#9CA3AF] mb-3">Select Barista</p>
                        {baristas.map((b, idx) => (
                            <button key={b.id} onClick={() => setSelectedBarista(b)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedBarista.id === b.id ? "border-[#EF4123] bg-[#FEF3F0]/40" : "border-[#EBEBEB] bg-white hover:border-[#EF4123]/30"}`}>
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[10px] shrink-0`}>
                                    {initials(b.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] text-[#1A1A2E] truncate">{b.name}</p>
                                    <p className="text-[10px] text-[#9CA3AF]">{b.employeeId}</p>
                                </div>
                                {saved === b.id && <Check className="w-4 h-4 text-green-500 shrink-0" />}
                            </button>
                        ))}
                    </div>

                    {/* PIN Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-6 shadow-sm h-fit">
                        <h3 className="text-[16px] text-[#EF4123] mb-1">Reset PIN</h3>
                        <p className="text-[12px] text-[#9CA3AF] mb-5">Setting PIN for: <span className="text-[#1A1A2E]">{selectedBarista.name}</span></p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">New PIN (4 digits) <span className="text-[#EF4123]">*</span></label>
                                <div className="relative">
                                    <input
                                        type={showPin ? "text" : "password"}
                                        maxLength={4}
                                        value={newPin}
                                        onChange={e => setNewPin(e.target.value.replace(/\D/g, ""))}
                                        placeholder="••••"
                                        className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] font-mono focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] tracking-widest"
                                    />
                                    <button onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[13px] text-[#6B7280] mb-2 block">Confirm PIN <span className="text-[#EF4123]">*</span></label>
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={confirmPin}
                                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                                    placeholder="••••"
                                    className="w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] font-mono focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123] tracking-widest"
                                />
                            </div>
                        </div>

                        <button onClick={handleSave} className={`mt-6 w-full py-3.5 rounded-xl text-[14px] transition-all ${saved === selectedBarista.id ? "bg-green-500 text-white" : "bg-[#EF4123] text-white hover:bg-[#D93A1F]"} shadow-sm`}>
                            {saved === selectedBarista.id ? <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> PIN Updated!</span> : "Update PIN"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
