import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import { ArrowLeft, Check } from "lucide-react";
import { baristas } from "./pos-data";

const shiftOptions = [
    { label: "Morning", time: "7:00 AM - 3:00 PM" },
    { label: "Afternoon", time: "1:00 PM - 10:00 PM" },
    { label: "Day Off", time: "" },
];

const avatarColors = [
    "from-orange-400 to-red-400",
    "from-pink-400 to-rose-400",
    "from-violet-400 to-purple-400",
    "from-teal-400 to-cyan-400",
    "from-blue-400 to-indigo-400",
];

const initials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

export function BaristaShiftPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [assignments, setAssignments] = useState<Record<string, string>>(
        Object.fromEntries(baristas.map(b => [b.id, b.shift || "Day Off"]))
    );
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} title="Atur Shift" subtitle="Assign and manage barista shifts" searchPlaceholder="Search barista..." />
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                <button onClick={() => navigate("/barista")} className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Barista
                </button>

                <div className="max-w-[700px] mx-auto">
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                            <h3 className="text-[15px] text-[#1A1A2E]">Shift Assignment</h3>
                            <span className="text-[11px] text-[#9CA3AF]">2026-03-06</span>
                        </div>

                        <div className="divide-y divide-[#F5F5F5]">
                            {baristas.filter(b => searchQuery ? b.name.toLowerCase().includes(searchQuery.toLowerCase()) : true).map((barista, idx) => (
                                <div key={barista.id} className="flex items-center gap-4 px-5 py-4">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[11px] shrink-0`}>
                                        {initials(barista.name)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] text-[#1A1A2E]">{barista.name}</p>
                                        <p className="text-[10px] text-[#9CA3AF]">{barista.position} · {barista.employeeId}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {shiftOptions.map(shift => {
                                            const val = shift.label === "Day Off" ? "-" : shift.time;
                                            const isSelected = assignments[barista.id] === val;
                                            return (
                                                <button
                                                    key={shift.label}
                                                    onClick={() => setAssignments(a => ({ ...a, [barista.id]: val }))}
                                                    className={`px-3 py-1.5 rounded-xl text-[11px] border transition-all ${isSelected
                                                        ? "bg-[#EF4123] text-white border-[#EF4123] shadow-sm"
                                                        : "bg-white text-[#6B7280] border-[#EBEBEB] hover:border-[#EF4123]/30"}`}
                                                >
                                                    {shift.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[11px] text-[#9CA3AF] w-40 text-right shrink-0">
                                        {assignments[barista.id] === "-" ? "Day Off" : assignments[barista.id]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="px-5 py-4 border-t border-[#F0F0F0] flex justify-end">
                            <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] transition-all ${saved ? "bg-green-500 text-white" : "bg-[#EF4123] text-white hover:bg-[#D93A1F]"} shadow-sm`}>
                                {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Assignments"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
