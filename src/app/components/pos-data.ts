// ─── Types ───────────────────────────────────────────────────────────────────

export type Category = "All" | "Coffee" | "Non Coffee" | "Tea" | "Pastries" | "Snacks";
export type SubCategory = "All" | "Latte" | "Essentials" | "Espresso" | "Specialty" | "Classic" | "Cold Brew" | "Signature";
export type DrinkType = "Iced" | "Hot";
export type DrinkSize = "Regular" | "Large";
export type SugarLevel = "Normal" | "Less" | "No Sugar";
export type MilkType = "Fresh Milk" | "Oat Milk" | "Soy Milk" | "Almond Milk" | "No Milk";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: Category;
  subCategory: SubCategory;
  image: string;
  stock: number;
  sku: string;
  discount?: number;
  status: boolean;
  description?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  notes: string;
  type?: DrinkType;
  size?: DrinkSize;
  sugarLevel?: SugarLevel;
  milk?: MilkType;
  addOns?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerAvatar: string;
  items: OrderItem[];
  orderType: "Pickup Order" | "Delivery Order" | "Dine In";
  status: "Received" | "In Progress" | "Ready" | "Completed";
  time: string;
  total: number;
  paymentMethod: string;
  notes: string;
  tableNumber?: string;
  platform?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  uom: string;
  conversion: string;
  soh: number;
  minStock: number;
  lastRestock: string;
}

export interface Barista {
  id: string;
  name: string;
  employeeId: string;
  shift: string;
  position: string;
  clockIn: string;
  status: string;
  avatar: string;
  grade: string;
  ordersHandled: number;
  avgTime: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const categories: Category[] = ["All", "Coffee", "Non Coffee", "Tea", "Pastries", "Snacks"];
export const subCategories: SubCategory[] = ["All", "Latte", "Essentials", "Espresso", "Specialty", "Classic", "Cold Brew", "Signature"];

export const drinkTypes: DrinkType[] = ["Iced", "Hot"];
export const drinkSizes: DrinkSize[] = ["Regular", "Large"];
export const sugarLevels: SugarLevel[] = ["Normal", "Less", "No Sugar"];
export const milkTypes: MilkType[] = ["Fresh Milk", "Oat Milk", "Soy Milk", "Almond Milk", "No Milk"];

export const addOnOptions = [
  { id: "extra-shot", name: "Extra Shot", price: 5000 },
  { id: "whipped-cream", name: "Whipped Cream", price: 5000 },
  { id: "caramel-drizzle", name: "Caramel Drizzle", price: 3000 },
  { id: "hazelnut-syrup", name: "Hazelnut Syrup", price: 5000 },
  { id: "vanilla-syrup", name: "Vanilla Syrup", price: 5000 },
];

export const sizePriceExtra: Record<DrinkSize, number> = {
  Regular: 0,
  Large: 6000,
};

// ─── Products ────────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: "1", name: "Caffe Latte", price: 32000, category: "Coffee", subCategory: "Latte",
    image: "https://images.unsplash.com/photo-1686575669781-74e03080541b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwbGF0dGUlMjBjb2ZmZWUlMjBnbGFzcyUyMGNhZmV8ZW58MXx8fHwxNzcyNjgwNDU3fDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 120, sku: "CL-CF-001", status: true, isBestSeller: true,
    description: "Smooth espresso with steamed milk, light foam top",
  },
  {
    id: "2", name: "Cappuccino", price: 30000, category: "Coffee", subCategory: "Essentials",
    image: "https://images.unsplash.com/photo-1743193143313-dc4693d88b3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwZm9hbSUyMGFydCUyMGNlcmFtaWN8ZW58MXx8fHwxNzcyNjgwNDU4fDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 98, sku: "CP-CF-002", discount: 15, oldPrice: 35000, status: true,
    description: "Equal parts espresso, steamed milk and milk foam",
  },
  {
    id: "3", name: "Espresso", price: 22000, category: "Coffee", subCategory: "Espresso",
    image: "https://images.unsplash.com/photo-1749466706718-f183d080b835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMHNob3QlMjBjcmVtYSUyMGRhcmt8ZW58MXx8fHwxNzcyNjgwNDU4fDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 320, sku: "ESP-CF-003", status: true,
    description: "Rich, concentrated single or double shot",
  },
  {
    id: "4", name: "Americano", price: 26000, category: "Coffee", subCategory: "Essentials",
    image: "https://images.unsplash.com/photo-1613146566227-75b0b5896d0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbm8lMjBibGFjayUyMGNvZmZlZSUyMG1pbmltYWx8ZW58MXx8fHwxNzcyNjgwNDU4fDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 280, sku: "AM-CF-004", status: true,
    description: "Espresso diluted with hot water for a clean taste",
  },
  {
    id: "5", name: "Caramel Macchiato", price: 38000, category: "Coffee", subCategory: "Signature",
    image: "https://images.unsplash.com/photo-1644418665364-bd62d3a4f7f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJhbWVsJTIwbWFjY2hpYXRvJTIwZHJpenpsZSUyMGdsYXNzfGVufDF8fHx8MTc3MjY4MDQ1OXww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 85, sku: "CM-CF-005", status: true, isNew: true,
    description: "Vanilla-flavored latte with caramel drizzle",
  },
  {
    id: "6", name: "Mocha", price: 36000, category: "Coffee", subCategory: "Specialty",
    image: "https://images.unsplash.com/photo-1596078841463-5504c992222f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NoYSUyMGNvZmZlZSUyMGNob2NvbGF0ZSUyMHdoaXBwZWR8ZW58MXx8fHwxNzcyNjgwNDYwfDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 72, sku: "MC-CF-006", status: true,
    description: "Espresso with chocolate sauce, steamed milk and whipped cream",
  },
  {
    id: "7", name: "Cold Brew", price: 30000, category: "Coffee", subCategory: "Cold Brew",
    image: "https://images.unsplash.com/photo-1601991056543-44a74b3731b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMGNvZmZlZSUyMGJvdHRsZXxlbnwxfHx8fDE3NzI1OTcyODd8MA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 55, sku: "CB-CF-007", status: true, isBestSeller: true,
    description: "Slow-steeped 18hrs for smooth, bold flavor",
  },
  {
    id: "8", name: "Flat White", price: 34000, category: "Coffee", subCategory: "Essentials",
    image: "https://images.unsplash.com/photo-1758180126924-052eaa5b93aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGF0JTIwd2hpdGUlMjBjb2ZmZWUlMjBjdXAlMjBjZXJhbWljfGVufDF8fHx8MTc3MjY4MDQ2MXww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 90, sku: "FW-CF-008", status: true,
    description: "Double ristretto with velvety microfoam",
  },
  {
    id: "9", name: "Vanilla Latte", price: 35000, category: "Coffee", subCategory: "Latte",
    image: "https://images.unsplash.com/photo-1579721333096-145ed9596b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW5pbGxhJTIwbGF0dGUlMjBjb2ZmZWUlMjBjcmVhbXl8ZW58MXx8fHwxNzcyNjgwNDYzfDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 68, sku: "VL-CF-009", discount: 20, oldPrice: 44000, status: true,
    description: "Classic latte with premium vanilla syrup",
  },
  {
    id: "10", name: "Affogato", price: 38000, category: "Coffee", subCategory: "Specialty",
    image: "https://images.unsplash.com/photo-1562037408-d1b741ccd19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZmZvZ2F0byUyMGljZSUyMGNyZWFtJTIwZXNwcmVzc298ZW58MXx8fHwxNzcyNjc0ODYyfDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 40, sku: "AF-CF-010", status: true,
    description: "Vanilla gelato drowned in a shot of espresso",
  },
  {
    id: "11", name: "Matcha Latte", price: 35000, category: "Non Coffee", subCategory: "Latte",
    image: "https://images.unsplash.com/photo-1768203630324-4a456ef7148f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZSUyMGdyZWVuJTIwdGVhJTIwYXJ0fGVufDF8fHx8MTc3MjY4MDQ1OXww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 45, sku: "ML-NC-011", discount: 10, oldPrice: 39000, status: true, isBestSeller: true,
    description: "Premium Uji matcha with steamed milk",
  },
  {
    id: "12", name: "Iced Chocolate", price: 32000, category: "Non Coffee", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1769437257860-e0347bd26798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY2hvY29sYXRlJTIwZHJpbmslMjBjYWZlfGVufDF8fHx8MTc3MjY4MDQ1OXww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 95, sku: "IC-NC-012", status: true,
    description: "Rich Belgian chocolate blended with cold milk",
  },
  {
    id: "13", name: "Chai Tea Latte", price: 30000, category: "Tea", subCategory: "Latte",
    image: "https://images.unsplash.com/photo-1620173766248-411954ff5694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFpJTIwdGVhJTIwbGF0dGUlMjBzcGljZSUyMHdhcm18ZW58MXx8fHwxNzcyNjgwNDYxfDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 60, sku: "CH-TE-013", status: true,
    description: "Spiced black tea with steamed milk and honey",
  },
  {
    id: "14", name: "Green Tea", price: 25000, category: "Tea", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1727175985949-c4fca96da7e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlYSUyMGphc21pbmUlMjBjdXAlMjB3YXJtfGVufDF8fHx8MTc3MjY4MDQ2Nnww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 75, sku: "GT-TE-014", status: true,
    description: "Japanese sencha green tea, light and refreshing",
  },
  {
    id: "15", name: "Lemon Tea", price: 24000, category: "Tea", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1772577305397-18b4d2db2114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMHRlYSUyMGljZWQlMjByZWZyZXNoaW5nJTIwZ2xhc3N8ZW58MXx8fHwxNzcyNjgwNDY4fDA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 80, sku: "LT-TE-015", status: true,
    description: "Fresh brewed tea with lemon and honey",
  },
  {
    id: "16", name: "Butter Croissant", price: 25000, category: "Pastries", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1681217723121-bbb28b55d166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNyb2lzc2FudCUyMGJha2VyeSUyMGJ1dHRlcnxlbnwxfHx8fDE3NzI2ODA0NjJ8MA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 18, sku: "CR-PS-016", status: true,
    description: "Flaky butter croissant, baked fresh daily",
  },
  {
    id: "17", name: "Choco Muffin", price: 22000, category: "Pastries", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1762417420596-b90e84efcfad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBtdWZmaW4lMjBwYXN0cnklMjBjYWZlfGVufDF8fHx8MTc3MjY4MDQ2Mnww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 0, sku: "CM-PS-017", status: true,
    description: "Double chocolate chip muffin, rich and moist",
  },
  {
    id: "18", name: "Banana Bread", price: 20000, category: "Pastries", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1622532631728-7a0f63b72dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBicmVhZCUyMHNsaWNlJTIwY2FmZSUyMHBsYXRlfGVufDF8fHx8MTc3MjY4MDQ2N3ww&ixlib=rb-4.1.0&q=80&w=400",
    stock: 12, sku: "BB-PS-018", status: true,
    description: "Homestyle banana bread with walnut",
  },
  {
    id: "19", name: "Cinnamon Roll", price: 28000, category: "Pastries", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1653592656327-bed286768abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMHJvbGwlMjBwYXN0cnklMjBpY2luZ3xlbnwxfHx8fDE3NzI2ODA0Njd8MA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 8, sku: "CIN-PS-019", status: true, isNew: true,
    description: "Warm cinnamon roll with cream cheese icing",
  },
  {
    id: "20", name: "Cookies", price: 18000, category: "Snacks", subCategory: "Classic",
    image: "https://images.unsplash.com/photo-1589102924186-91e9f4058dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raWVzJTIwYmlzY3VpdCUyMHBsYXRlJTIwZGVzc2VydHxlbnwxfHx8fDE3NzI2ODA0NjJ8MA&ixlib=rb-4.1.0&q=80&w=400",
    stock: 50, sku: "CK-SN-020", status: true,
    description: "Classic choco-chip cookies, set of 3",
  },
];

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders: Order[] = [
  {
    id: "1", orderNumber: "#ORD-20260305-001", customer: "Fatima Azzahra", customerAvatar: "",
    items: [
      { product: products[0], quantity: 1, notes: "Extra hot", type: "Hot", size: "Large", sugarLevel: "Less", milk: "Oat Milk" },
      { product: products[15], quantity: 2, notes: "" },
    ],
    orderType: "Pickup Order", status: "Received", time: "10:12 AM", total: 82000,
    paymentMethod: "DANA", notes: "Saya akan ke toko sebentar lagi, tolong segera dipersiapkan. Makasih!",
    platform: "GrabFood",
  },
  {
    id: "2", orderNumber: "#ORD-20260305-002", customer: "Liam Nasution", customerAvatar: "",
    items: [
      { product: products[4], quantity: 2, notes: "", type: "Iced", size: "Large", sugarLevel: "Normal", milk: "Fresh Milk" },
      { product: products[5], quantity: 1, notes: "No whipped cream", type: "Iced", size: "Regular", sugarLevel: "Less", milk: "Fresh Milk" },
    ],
    orderType: "Delivery Order", status: "Received", time: "10:14 AM", total: 118000,
    paymentMethod: "GoPay", notes: "",
    platform: "GoFood",
  },
  {
    id: "3", orderNumber: "#ORD-20260305-003", customer: "Hendra Wijaya", customerAvatar: "",
    items: [
      { product: products[6], quantity: 1, notes: "", type: "Iced", size: "Large", sugarLevel: "No Sugar", milk: "No Milk" },
    ],
    orderType: "Pickup Order", status: "Received", time: "10:15 AM", total: 36000,
    paymentMethod: "OVO", notes: "",
  },
  {
    id: "4", orderNumber: "#ORD-20260305-004", customer: "Agustina Rahayu", customerAvatar: "",
    items: [
      { product: products[10], quantity: 1, notes: "", type: "Iced", size: "Regular", sugarLevel: "Normal", milk: "Oat Milk" },
      { product: products[19], quantity: 1, notes: "" },
    ],
    orderType: "Dine In", status: "In Progress", time: "9:58 AM", total: 53000,
    paymentMethod: "QRIS", notes: "", tableNumber: "T-05",
  },
  {
    id: "5", orderNumber: "#ORD-20260305-005", customer: "Budi Santoso", customerAvatar: "",
    items: [
      { product: products[3], quantity: 2, notes: "", type: "Hot", size: "Regular", sugarLevel: "No Sugar", milk: "No Milk" },
      { product: products[16], quantity: 1, notes: "" },
    ],
    orderType: "Dine In", status: "Ready", time: "9:42 AM", total: 74000,
    paymentMethod: "Cash", notes: "", tableNumber: "T-02",
  },
  {
    id: "6", orderNumber: "#ORD-20260305-006", customer: "Sari Dewi", customerAvatar: "",
    items: [
      { product: products[8], quantity: 1, notes: "", type: "Iced", size: "Large", sugarLevel: "Normal", milk: "Fresh Milk" },
    ],
    orderType: "Pickup Order", status: "Completed", time: "9:30 AM", total: 41000,
    paymentMethod: "ShopeePay", notes: "",
  },
  {
    id: "7", orderNumber: "#ORD-20260305-007", customer: "Rika Permata", customerAvatar: "",
    items: [
      { product: products[1], quantity: 1, notes: "", type: "Hot", size: "Regular", sugarLevel: "Less", milk: "Fresh Milk" },
      { product: products[18], quantity: 1, notes: "" },
    ],
    orderType: "Dine In", status: "Completed", time: "9:15 AM", total: 58000,
    paymentMethod: "Debit Card", notes: "", tableNumber: "T-08",
  },
];

// ─── Inventory ───────────────────────────────────────────────────────────────

export const inventoryItems: InventoryItem[] = [
  { id: "1", name: "Brew Blend Beans", category: "Coffee Beans", sku: "BB-CB-001", uom: "Kg", conversion: "Gram (gr)", soh: 3, minStock: 5, lastRestock: "2026-02-28" },
  { id: "2", name: "Fresh Milk", category: "Dairy", sku: "FM-DY-002", uom: "Liter", conversion: "Milliliters (ml)", soh: 4, minStock: 10, lastRestock: "2026-03-04" },
  { id: "3", name: "Caramel Syrup", category: "Syrup", sku: "CS-SY-003", uom: "Bottle (750ml)", conversion: "Milliliters (ml)", soh: 4, minStock: 3, lastRestock: "2026-03-01" },
  { id: "4", name: "Honey", category: "Sweetener", sku: "HNY-SW-004", uom: "Bottle (500ml)", conversion: "Milliliters (ml)", soh: 5, minStock: 3, lastRestock: "2026-02-25" },
  { id: "5", name: "Oat Milk", category: "Dairy Alt.", sku: "OM-DA-005", uom: "Liter", conversion: "Milliliters (ml)", soh: 7, minStock: 8, lastRestock: "2026-03-03" },
  { id: "6", name: "Soy Milk", category: "Dairy Alt.", sku: "SM-DA-006", uom: "Liter", conversion: "Milliliters (ml)", soh: 12, minStock: 6, lastRestock: "2026-03-02" },
  { id: "7", name: "Hazelnut Syrup", category: "Syrup", sku: "HS-SY-007", uom: "Bottle (750ml)", conversion: "Milliliters (ml)", soh: 6, minStock: 3, lastRestock: "2026-02-28" },
  { id: "8", name: "Matcha Powder", category: "Powder", sku: "MP-PW-008", uom: "Tin (100g)", conversion: "-", soh: 8, minStock: 5, lastRestock: "2026-03-01" },
  { id: "9", name: "Vanilla Syrup", category: "Syrup", sku: "VS-SY-009", uom: "Bottle (750ml)", conversion: "Milliliters (ml)", soh: 5, minStock: 3, lastRestock: "2026-02-26" },
  { id: "10", name: "Chocolate Sauce", category: "Sauce", sku: "CS-SC-010", uom: "Bottle (1L)", conversion: "Milliliters (ml)", soh: 9, minStock: 4, lastRestock: "2026-03-03" },
  { id: "11", name: "Almond Milk", category: "Dairy Alt.", sku: "AM-DA-011", uom: "Liter", conversion: "Milliliters (ml)", soh: 3, minStock: 5, lastRestock: "2026-03-01" },
  { id: "12", name: "Whipped Cream", category: "Topping", sku: "WC-TP-012", uom: "Can (500g)", conversion: "-", soh: 6, minStock: 4, lastRestock: "2026-03-04" },
];

// ─── Baristas ────────────────────────────────────────────────────────────────

export const baristas: Barista[] = [
  { id: "1", name: "Logan Roy", employeeId: "EMP-1029", shift: "1:00 PM - 10:00 PM", position: "Head Barista", clockIn: "12:54 PM", status: "Active", avatar: "", grade: "A", ordersHandled: 847, avgTime: "3m 12s" },
  { id: "2", name: "Theresia Hutabarat", employeeId: "EMP-1030", shift: "7:00 AM - 3:00 PM", position: "Senior Barista", clockIn: "6:42 AM", status: "Active", avatar: "", grade: "A", ordersHandled: 723, avgTime: "3m 45s" },
  { id: "3", name: "Hanum Kirana", employeeId: "EMP-2019", shift: "1:00 PM - 10:00 PM", position: "Barista", clockIn: "1:02 PM", status: "Active", avatar: "", grade: "B+", ordersHandled: 412, avgTime: "4m 10s" },
  { id: "4", name: "Fitra Eri Putra", employeeId: "EMP-6729", shift: "-", position: "Barista", clockIn: "-", status: "On Leave", avatar: "", grade: "B", ordersHandled: 385, avgTime: "4m 32s" },
  { id: "5", name: "Dina Ayu Lestari", employeeId: "EMP-3301", shift: "7:00 AM - 3:00 PM", position: "Barista (Trainee)", clockIn: "6:55 AM", status: "Active", avatar: "", grade: "B", ordersHandled: 156, avgTime: "5m 20s" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function calculateItemPrice(item: OrderItem): number {
  let price = item.product.price;
  if (item.size === "Large") price += sizePriceExtra.Large;
  if (item.addOns) {
    item.addOns.forEach((addonId) => {
      const addon = addOnOptions.find((a) => a.id === addonId);
      if (addon) price += addon.price;
    });
  }
  return price * item.quantity;
}

export const paymentMethods = [
  { id: "qris", name: "QRIS", icon: "qr" as const },
  { id: "gopay", name: "GoPay", icon: "wallet" as const },
  { id: "ovo", name: "OVO", icon: "wallet" as const },
  { id: "dana", name: "DANA", icon: "wallet" as const },
  { id: "shopeepay", name: "ShopeePay", icon: "wallet" as const },
  { id: "cash", name: "Tunai", icon: "cash" as const },
  { id: "debit", name: "Debit", icon: "card" as const },
  { id: "credit", name: "Credit", icon: "card" as const },
];

export function getCategoryCount(cat: Category): number {
  if (cat === "All") return products.length;
  return products.filter((p) => p.category === cat).length;
}
