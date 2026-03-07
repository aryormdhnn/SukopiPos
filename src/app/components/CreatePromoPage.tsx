import { useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "./TopBar";
import {
    ArrowLeft,
    Tag,
    Percent,
    Gift,
    Package,
    Calendar,
    ChevronDown,
    AlertCircle,
    ShoppingBag,
} from "lucide-react";

type PromoType = "Discount" | "BOGO" | "Bundle" | "FreeItem";
type DiscountUnit = "percent" | "rupiah";
type AppliesTo = "all" | "category" | "product";

const promoTypes: { type: PromoType; label: string; desc: string; icon: React.ElementType; color: string }[] = [
    { type: "Discount", label: "Diskon", desc: "Potongan harga dalam % atau Rp", icon: Percent, color: "text-red-500 bg-red-50" },
    { type: "BOGO", label: "Buy X Get Y", desc: "Beli X gratis Y item", icon: Gift, color: "text-blue-500 bg-blue-50" },
    { type: "Bundle", label: "Bundle", desc: "Bundel beberapa produk", icon: Package, color: "text-amber-500 bg-amber-50" },
    { type: "FreeItem", label: "Gratis Item", desc: "Gratis item tertentu dengan min. order", icon: ShoppingBag, color: "text-green-500 bg-green-50" },
];

const categories = ["Coffee", "Non-Coffee", "Food", "Snack", "Merchandise"];

const inputCls =
    "w-full px-4 py-2.5 bg-[#F5F5F5] border border-[#EBEBEB] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#EF4123]/20 focus:border-[#EF4123]";
const labelCls = "text-[13px] text-[#6B7280] mb-1.5 block";

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-[15px] font-semibold text-[#EF4123] mb-4">{children}</h3>;
}

function Divider() {
    return <div className="border-t border-[#F0F0F0] my-6" />;
}

export function CreatePromoPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // ── Basic Info ──────────────────────────────────────────────────
    const [promoName, setPromoName] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [description, setDescription] = useState("");
    const [promoType, setPromoType] = useState<PromoType>("Discount");

    // ── Promo Value ─────────────────────────────────────────────────
    const [discountUnit, setDiscountUnit] = useState<DiscountUnit>("percent");
    const [discountValue, setDiscountValue] = useState("");
    const [maxDiscount, setMaxDiscount] = useState("");   // cap if percent
    const [buyQty, setBuyQty] = useState("2");            // BOGO buy X
    const [getQty, setGetQty] = useState("1");            // BOGO get Y free
    const [freeItem, setFreeItem] = useState("");          // FreeItem label
    const [bundlePrice, setBundlePrice] = useState("");    // Bundle fixed price

    // ── Applies To ──────────────────────────────────────────────────
    const [appliesTo, setAppliesTo] = useState<AppliesTo>("all");
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [productName, setProductName] = useState("");

    // ── Conditions ──────────────────────────────────────────────────
    const [minOrder, setMinOrder] = useState("");
    const [maxUsage, setMaxUsage] = useState("");          // total quota
    const [perUserLimit, setPerUserLimit] = useState("1");

    // ── Period ──────────────────────────────────────────────────────
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("23:59");

    // ── Status ──────────────────────────────────────────────────────
    const [isActive, setIsActive] = useState(true);

    // ── Error ────────────────────────────────────────────────────────
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ── Helpers ──────────────────────────────────────────────────────
    const generateCode = () => {
        const prefix = promoName.trim().split(" ")[0].toUpperCase().substring(0, 5) || "PROMO";
        const rand = Math.floor(Math.random() * 9000 + 1000);
        setPromoCode(`${prefix}${rand}`);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!promoName.trim()) e.promoName = "Nama promo wajib diisi";
        if (!startDate) e.startDate = "Tanggal mulai wajib diisi";
        if (!endDate) e.endDate = "Tanggal selesai wajib diisi";
        if (startDate && endDate && startDate > endDate) e.endDate = "Tanggal selesai harus setelah tanggal mulai";
        if (promoType === "Discount" && !discountValue) e.discountValue = "Nilai diskon wajib diisi";
        if (promoType === "Bundle" && !bundlePrice) e.bundlePrice = "Harga bundle wajib diisi";
        if (promoType === "FreeItem" && !freeItem) e.freeItem = "Item gratis wajib diisi";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        // In a real app, send to API
        alert(`Promo "${promoName}" berhasil dibuat!`);
        navigate("/report/promo");
    };

    const fieldError = (key: string) =>
        errors[key] ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                <AlertCircle className="w-3 h-3" /> {errors[key]}
            </p>
        ) : null;

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAFAFA]">
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                title="Buat Promo"
                subtitle="Tambah promosi atau diskon baru"
                searchPlaceholder="Search..."
            />

            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-5">
                {/* Back */}
                <button
                    onClick={() => navigate("/report/promo")}
                    className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#EF4123] transition-colors mb-5"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Promo
                </button>

                <div className="max-w-[840px] mx-auto space-y-5">

                    {/* ── Section 1: Tipe Promo ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <SectionTitle>Tipe Promo</SectionTitle>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {promoTypes.map(({ type, label, desc, icon: Icon, color }) => (
                                <button
                                    key={type}
                                    onClick={() => setPromoType(type)}
                                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${promoType === type
                                            ? "border-[#EF4123] bg-[#FEF3F0]"
                                            : "border-[#EBEBEB] hover:border-[#EF4123]/30 hover:bg-[#FAFAFA]"
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-[#1A1A2E]">{label}</p>
                                        <p className="text-[10px] text-[#9CA3AF] leading-tight mt-0.5">{desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Section 2: Informasi Dasar ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <SectionTitle>Informasi Dasar</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Nama Promo */}
                            <div className="col-span-2">
                                <label className={labelCls}>
                                    Nama Promo <span className="text-[#EF4123]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={promoName}
                                    onChange={(e) => setPromoName(e.target.value)}
                                    placeholder="cth. Happy Hour Weekend"
                                    className={inputCls}
                                />
                                {fieldError("promoName")}
                            </div>

                            {/* Kode Promo */}
                            <div>
                                <label className={labelCls}>Kode Promo</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="cth. HAPPY20"
                                        className={`${inputCls} flex-1 font-mono`}
                                    />
                                    <button
                                        onClick={generateCode}
                                        className="px-4 py-2.5 bg-[#EF4123] text-white text-[12px] rounded-xl hover:bg-[#D93A1F] whitespace-nowrap transition-colors"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Tag Icon */}
                            <div className="flex items-end">
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F5] rounded-xl border border-[#EBEBEB] w-full">
                                    <Tag className="w-4 h-4 text-[#9CA3AF]" />
                                    <span className="text-[13px] text-[#9CA3AF]">
                                        {promoCode ? promoCode : "Kode akan tampil disini"}
                                    </span>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="col-span-2">
                                <label className={labelCls}>Deskripsi</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Deskripsi singkat tentang promo ini..."
                                    rows={2}
                                    className={`${inputCls} resize-none`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 3: Nilai Promo ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <SectionTitle>Nilai Promo</SectionTitle>

                        {promoType === "Discount" && (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Unit Toggle */}
                                <div className="col-span-2">
                                    <label className={labelCls}>Tipe Diskon</label>
                                    <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-xl w-fit">
                                        {(["percent", "rupiah"] as DiscountUnit[]).map((u) => (
                                            <button
                                                key={u}
                                                onClick={() => setDiscountUnit(u)}
                                                className={`px-5 py-1.5 rounded-lg text-[12px] transition-all ${discountUnit === u
                                                        ? "bg-white text-[#1A1A2E] shadow-sm"
                                                        : "text-[#9CA3AF]"
                                                    }`}
                                            >
                                                {u === "percent" ? "Persen (%)" : "Nominal (Rp)"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={labelCls}>
                                        Nilai Diskon <span className="text-[#EF4123]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF]">
                                            {discountUnit === "percent" ? "%" : "Rp"}
                                        </span>
                                        <input
                                            type="number"
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(e.target.value)}
                                            placeholder={discountUnit === "percent" ? "20" : "10000"}
                                            min="0"
                                            max={discountUnit === "percent" ? "100" : undefined}
                                            className={`${inputCls} pl-10`}
                                        />
                                    </div>
                                    {fieldError("discountValue")}
                                </div>

                                {discountUnit === "percent" && (
                                    <div>
                                        <label className={labelCls}>Maks. Diskon (Rp)</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF]">Rp</span>
                                            <input
                                                type="number"
                                                value={maxDiscount}
                                                onChange={(e) => setMaxDiscount(e.target.value)}
                                                placeholder="Opsional"
                                                className={`${inputCls} pl-10`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {promoType === "BOGO" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Beli (X item)</label>
                                    <input
                                        type="number"
                                        value={buyQty}
                                        onChange={(e) => setBuyQty(e.target.value)}
                                        min="1"
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Gratis (Y item)</label>
                                    <input
                                        type="number"
                                        value={getQty}
                                        onChange={(e) => setGetQty(e.target.value)}
                                        min="1"
                                        className={inputCls}
                                    />
                                </div>
                                <div className="col-span-2 p-3 bg-blue-50 rounded-xl text-[13px] text-blue-700 flex items-center gap-2">
                                    <Gift className="w-4 h-4 shrink-0" />
                                    Pelanggan beli <strong>{buyQty}</strong> item, gratis <strong>{getQty}</strong> item
                                </div>
                            </div>
                        )}

                        {promoType === "Bundle" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>
                                        Harga Bundle (Rp) <span className="text-[#EF4123]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF]">Rp</span>
                                        <input
                                            type="number"
                                            value={bundlePrice}
                                            onChange={(e) => setBundlePrice(e.target.value)}
                                            placeholder="50000"
                                            className={`${inputCls} pl-10`}
                                        />
                                    </div>
                                    {fieldError("bundlePrice")}
                                </div>
                                <div>
                                    <label className={labelCls}>Jumlah Item dalam Bundle</label>
                                    <input type="number" defaultValue="2" min="2" className={inputCls} />
                                </div>
                            </div>
                        )}

                        {promoType === "FreeItem" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className={labelCls}>
                                        Item Gratis <span className="text-[#EF4123]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={freeItem}
                                        onChange={(e) => setFreeItem(e.target.value)}
                                        placeholder="cth. Air Mineral"
                                        className={inputCls}
                                    />
                                    {fieldError("freeItem")}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Section 4: Berlaku Untuk ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <SectionTitle>Berlaku Untuk</SectionTitle>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                {(["all", "category", "product"] as AppliesTo[]).map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAppliesTo(a)}
                                        className={`px-4 py-2 rounded-xl text-[12px] border transition-all ${appliesTo === a
                                                ? "border-[#EF4123] bg-[#FEF3F0] text-[#EF4123]"
                                                : "border-[#EBEBEB] text-[#6B7280] hover:border-[#EF4123]/30"
                                            }`}
                                    >
                                        {a === "all" ? "Semua Menu" : a === "category" ? "Per Kategori" : "Produk Tertentu"}
                                    </button>
                                ))}
                            </div>

                            {appliesTo === "category" && (
                                <div>
                                    <label className={labelCls}>Pilih Kategori</label>
                                    <div className="relative">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className={`${inputCls} appearance-none`}
                                        >
                                            {categories.map((c) => (
                                                <option key={c}>{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            )}

                            {appliesTo === "product" && (
                                <div>
                                    <label className={labelCls}>Nama Produk</label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Ketik nama produk..."
                                        className={inputCls}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Section 5: Syarat & Ketentuan ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <SectionTitle>Syarat & Ketentuan</SectionTitle>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelCls}>Min. Order (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF]">Rp</span>
                                    <input
                                        type="number"
                                        value={minOrder}
                                        onChange={(e) => setMinOrder(e.target.value)}
                                        placeholder="0"
                                        className={`${inputCls} pl-10`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Kuota Total</label>
                                <input
                                    type="number"
                                    value={maxUsage}
                                    onChange={(e) => setMaxUsage(e.target.value)}
                                    placeholder="Tidak terbatas"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Batas per Pelanggan</label>
                                <input
                                    type="number"
                                    value={perUserLimit}
                                    onChange={(e) => setPerUserLimit(e.target.value)}
                                    min="1"
                                    placeholder="1"
                                    className={inputCls}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 6: Periode Promo ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <SectionTitle>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Periode Promo
                            </span>
                        </SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>
                                    Tanggal Mulai <span className="text-[#EF4123]">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={inputCls}
                                />
                                {fieldError("startDate")}
                            </div>
                            <div>
                                <label className={labelCls}>
                                    Tanggal Selesai <span className="text-[#EF4123]">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={inputCls}
                                />
                                {fieldError("endDate")}
                            </div>
                            <div>
                                <label className={labelCls}>Jam Mulai</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Jam Selesai</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 7: Status ── */}
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[14px] font-medium text-[#1A1A2E]">Status Promo</p>
                                <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                                    {isActive ? "Promo aktif dan bisa digunakan" : "Promo nonaktif, tidak bisa digunakan"}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? "bg-[#EF4123]" : "bg-[#D1D5DB]"}`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-6" : ""
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/report/promo")}
                            className="flex-1 py-3.5 bg-white text-[#6B7280] text-[14px] rounded-xl border border-[#EBEBEB] hover:bg-[#F5F5F5] transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-2 px-10 py-3.5 bg-[#EF4123] text-white text-[14px] rounded-xl hover:bg-[#D93A1F] transition-colors shadow-sm shadow-[#EF4123]/25"
                        >
                            Simpan Promo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
