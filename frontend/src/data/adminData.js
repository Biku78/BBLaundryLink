// Sample data for the BB LaundryLink admin console.
// Everything here is local sample data — replace `loadDb` in services/adminApi.js
// with real API calls when the backend endpoints exist.

export const ORDER_PIPELINE = ["Placed", "Confirmed", "Picked up", "In wash", "Ready", "Delivered"];

export const SERVICES = [
  { id: "wash-fold", name: "Wash & Fold", unit: "per kg", price: 50, mrp: 70, active: true, turnaround: "24 hrs" },
  { id: "dry-clean", name: "Dry Cleaning", unit: "per piece", price: 100, mrp: 130, active: true, turnaround: "48 hrs" },
  { id: "ironing", name: "Ironing", unit: "per piece", price: 20, mrp: 28, active: true, turnaround: "12 hrs" },
  { id: "shoe-care", name: "Shoe Care", unit: "per pair", price: 149, mrp: 199, active: true, turnaround: "72 hrs" },
  { id: "premium", name: "Premium Care", unit: "per piece", price: 199, mrp: 249, active: false, turnaround: "72 hrs" },
  { id: "pickup", name: "Pickup & Delivery", unit: "per order", price: 0, mrp: 0, active: true, turnaround: "30 mins" },
];

export const PARTNERS = [
  {
    id: "freshwash", name: "FreshWash Laundry", area: "Patia, Bhubaneswar", owner: "Sourav Das",
    phone: "98610 45231", email: "freshwash@bbll.in", status: "active", rating: 4.7, reviews: 1240,
    orders: 486, gmv: 128400, commission: 12, joined: "2025-11-02", img: "/images/bento-freshwash.webp",
    services: ["Wash & Fold", "Ironing"], payout: "Weekly · every Monday", docs: "verified",
  },
  {
    id: "cleancare", name: "CleanCare Laundry", area: "Kharavela Nagar, BBSR", owner: "Anita Mishra",
    phone: "90901 77420", email: "cleancare@bbll.in", status: "active", rating: 4.6, reviews: 980,
    orders: 372, gmv: 96400, commission: 12, joined: "2025-09-14", img: "/images/bento-cleancare.webp",
    services: ["Dry Cleaning", "Wash & Fold"], payout: "Weekly · every Monday", docs: "verified",
  },
  {
    id: "smartwash", name: "SmartWash Laundry", area: "IRC Village, BBSR", owner: "Pratik Nayak",
    phone: "93371 22018", email: "smartwash@bbll.in", status: "active", rating: 4.8, reviews: 2100,
    orders: 611, gmv: 172800, commission: 10, joined: "2025-07-21", img: "/images/bento-smartwash.webp",
    services: ["Wash & Fold", "Ironing", "Dry Cleaning"], payout: "Weekly · every Monday", docs: "verified",
  },
  {
    id: "suds", name: "Suds & Shine Hub", area: "Saheed Nagar, BBSR", owner: "Bandana Sahu",
    phone: "70083 91007", email: "suds@bbll.in", status: "pending", rating: 0, reviews: 0,
    orders: 0, gmv: 0, commission: 12, joined: "2026-11-24", img: "/images/bento-suds.webp",
    services: ["Wash & Fold"], payout: "Not configured", docs: "pending",
  },
  {
    id: "urbanpress", name: "UrbanPress Studio", area: "Khandagiri, BBSR", owner: "Imran Khan",
    phone: "88951 66342", email: "urbanpress@bbll.in", status: "pending", rating: 0, reviews: 0,
    orders: 0, gmv: 0, commission: 14, joined: "2026-11-26", img: "/images/bento-urbanpress.webp",
    services: ["Dry Cleaning", "Ironing"], payout: "Not configured", docs: "pending",
  },
  {
    id: "ecowash", name: "EcoWash Hub", area: "Chandrasekharpur, BBSR", owner: "Manoj Behera",
    phone: "94370 11928", email: "ecowash@bbll.in", status: "pending", rating: 0, reviews: 0,
    orders: 0, gmv: 0, commission: 12, joined: "2026-11-27", img: "/images/bento-ecowash.webp",
    services: ["Wash & Fold", "Shoe Care"], payout: "Not configured", docs: "pending",
  },
  {
    id: "citypress", name: "CityPress Laundry", area: "Old Town, BBSR", owner: "Sanjay Rout",
    phone: "82605 77310", email: "citypress@bbll.in", status: "suspended", rating: 3.9, reviews: 214,
    orders: 98, gmv: 21400, commission: 12, joined: "2025-12-08", img: "/images/bento-suds.webp",
    services: ["Ironing"], payout: "On hold", docs: "verified", note: "Suspended for repeated late deliveries.",
  },
];

export const ORDERS = [
  { id: "BB-2841", customer: "Ritika Sahoo", partner: "SmartWash Laundry", service: "Wash & Fold", qty: "4 kg", amount: 180, status: "In wash", payment: "UPI", placed: "Today, 12:20 PM", slot: "Pickup 4:00 PM", area: "Patia" },
  { id: "BB-2840", customer: "Abhijit Pradhan", partner: "FreshWash Laundry", service: "Ironing", qty: "6 pcs", amount: 120, status: "Picked up", payment: "Wallet", placed: "Today, 11:05 AM", slot: "Pickup 2:00 PM", area: "Saheed Nagar" },
  { id: "BB-2839", customer: "Sneha Patel", partner: "CleanCare Laundry", service: "Dry Cleaning", qty: "2 pcs", amount: 320, status: "Ready", payment: "Paid online", placed: "Today, 9:48 AM", slot: "Delivery 7:30 PM", area: "Kharavela Nagar" },
  { id: "BB-2838", customer: "Rakesh Mohanty", partner: "SmartWash Laundry", service: "Wash & Fold", qty: "3 kg", amount: 135, status: "Confirmed", payment: "UPI", placed: "Today, 9:10 AM", slot: "Pickup 11:00 AM", area: "IRC Village" },
  { id: "BB-2837", customer: "Priya Nayak", partner: "FreshWash Laundry", service: "Shoe Care", qty: "1 pair", amount: 149, status: "Delivered", payment: "Cash", placed: "Yesterday, 6:40 PM", slot: "Delivered 11:00 AM", area: "Patia" },
  { id: "BB-2836", customer: "Debasish Jena", partner: "CleanCare Laundry", service: "Wash & Fold", qty: "5 kg", amount: 250, status: "Delivered", payment: "UPI", placed: "Yesterday, 4:15 PM", slot: "Delivered 10:20 AM", area: "Nayapalli" },
  { id: "BB-2835", customer: "Meera Behera", partner: "SmartWash Laundry", service: "Dry Cleaning", qty: "3 pcs", amount: 300, status: "Cancelled", payment: "Refunded", placed: "Yesterday, 2:02 PM", slot: "—", area: "Jaydev Vihar" },
  { id: "BB-2834", customer: "Ankit Rana", partner: "FreshWash Laundry", service: "Wash & Fold", qty: "2 kg", amount: 90, status: "Delivered", payment: "Wallet", placed: "Yesterday, 11:30 AM", slot: "Delivered 8:00 AM", area: "Chandrasekharpur" },
  { id: "BB-2833", customer: "Lipsa Das", partner: "CleanCare Laundry", service: "Ironing", qty: "8 pcs", amount: 160, status: "Placed", payment: "UPI", placed: "Today, 1:05 PM", slot: "Pickup 5:30 PM", area: "Rasulgarh" },
  { id: "BB-2832", customer: "Tanmay Sethi", partner: "SmartWash Laundry", service: "Wash & Fold", qty: "6 kg", amount: 270, status: "Delivered", payment: "Paid online", placed: "27 Nov, 7:20 PM", slot: "Delivered 6:00 PM", area: "Patia" },
  { id: "BB-2831", customer: "Ipsita Rout", partner: "FreshWash Laundry", service: "Dry Cleaning", qty: "1 pc", amount: 130, status: "Delivered", payment: "UPI", placed: "27 Nov, 5:12 PM", slot: "Delivered 4:00 PM", area: "Saheed Nagar" },
  { id: "BB-2830", customer: "Soumya Kar", partner: "CleanCare Laundry", service: "Wash & Fold", qty: "3 kg", amount: 150, status: "Delivered", payment: "Cash", placed: "27 Nov, 1:40 PM", slot: "Delivered 12:30 PM", area: "Kharavela Nagar" },
];

export const CUSTOMERS = [
  { id: "C-1042", name: "Ritika Sahoo", email: "ritika@yopmail.com", phone: "98610 33421", orders: 34, spend: 6420, wallet: 250, joined: "2025-08-11", status: "active", area: "Patia", img: "/images/avatar-sample.webp" },
  { id: "C-1041", name: "Abhijit Pradhan", email: "abhijit@yopmail.com", phone: "90901 22190", orders: 21, spend: 3980, wallet: 120, joined: "2025-10-02", status: "active", area: "Saheed Nagar", img: "/images/avatar-sample.webp" },
  { id: "C-1040", name: "Sneha Patel", email: "sneha@yopmail.com", phone: "70083 47761", orders: 12, spend: 2140, wallet: 0, joined: "2026-01-19", status: "active", area: "Kharavela Nagar", img: "/images/avatar-sample.webp" },
  { id: "C-1039", name: "Rakesh Mohanty", email: "rakesh@yopmail.com", phone: "93371 90021", orders: 8, spend: 1120, wallet: 80, joined: "2026-03-04", status: "active", area: "IRC Village", img: "/images/avatar-sample.webp" },
  { id: "C-1038", name: "Meera Behera", email: "meera@yopmail.com", phone: "88951 11002", orders: 5, spend: 760, wallet: 0, joined: "2026-06-22", status: "blocked", area: "Jaydev Vihar", img: "/images/avatar-sample.webp" },
  { id: "C-1037", name: "Debasish Jena", email: "debasish@yopmail.com", phone: "94370 88210", orders: 17, spend: 3290, wallet: 150, joined: "2025-12-30", status: "active", area: "Nayapalli", img: "/images/avatar-sample.webp" },
  { id: "C-1036", name: "Lipsa Das", email: "lipsa@yopmail.com", phone: "82605 66129", orders: 3, spend: 420, wallet: 0, joined: "2026-09-15", status: "active", area: "Rasulgarh", img: "/images/avatar-sample.webp" },
  { id: "C-1035", name: "Tanmay Sethi", email: "tanmay@yopmail.com", phone: "98610 77451", orders: 26, spend: 5120, wallet: 300, joined: "2025-07-08", status: "active", area: "Patia", img: "/images/avatar-sample.webp" },
];

export const COUPONS = [
  { id: "cp-1", code: "WELCOME10", title: "10% off first order", type: "percent", value: 10, maxDiscount: 150, minOrder: 299, uses: 428, limit: 1000, active: true, expires: "2027-03-31" },
  { id: "cp-2", code: "FREEPICKUP", title: "Free pickup & delivery", type: "shipping", value: 0, maxDiscount: 40, minOrder: 199, uses: 812, limit: 2000, active: true, expires: "2027-01-31" },
  { id: "cp-3", code: "WASH3GET1", title: "Buy 3kg get 1kg free", type: "flat", value: 50, maxDiscount: 50, minOrder: 150, uses: 196, limit: 500, active: true, expires: "2026-12-31" },
  { id: "cp-4", code: "BHUBANESWAR20", title: "₹20 off in Bhubaneswar", type: "flat", value: 20, maxDiscount: 20, minOrder: 99, uses: 640, limit: 640, active: false, expires: "2026-10-31" },
];

export const SETTLEMENTS = [
  { id: "ST-0912", partner: "SmartWash Laundry", period: "18 – 24 Nov 2026", orders: 96, gross: 28400, commission: 2840, payout: 25560, status: "paid", method: "IMPS", date: "25 Nov 2026" },
  { id: "ST-0911", partner: "FreshWash Laundry", period: "18 – 24 Nov 2026", orders: 74, gross: 21600, commission: 2592, payout: 19008, status: "paid", method: "IMPS", date: "25 Nov 2026" },
  { id: "ST-0910", partner: "CleanCare Laundry", period: "18 – 24 Nov 2026", orders: 58, gross: 18200, commission: 2184, payout: 16016, status: "pending", method: "NEFT", date: "Due 28 Nov 2026" },
  { id: "ST-0909", partner: "CityPress Laundry", period: "18 – 24 Nov 2026", orders: 12, gross: 3400, commission: 408, payout: 2992, status: "on-hold", method: "NEFT", date: "Held — partner suspended" },
  { id: "ST-0908", partner: "SmartWash Laundry", period: "11 – 17 Nov 2026", orders: 88, gross: 26100, commission: 2610, payout: 23490, status: "paid", method: "IMPS", date: "18 Nov 2026" },
];

export const REVIEWS = [
  { id: "rv-1", customer: "Ritika Sahoo", partner: "SmartWash Laundry", rating: 5, text: "Clothes came back spotless and folded neatly. Pickup was 10 minutes early!", date: "27 Nov", status: "published" },
  { id: "rv-2", customer: "Abhijit Pradhan", partner: "FreshWash Laundry", rating: 4, text: "Good ironing, but one shirt was delivered a day late.", date: "26 Nov", status: "published" },
  { id: "rv-3", customer: "Meera Behera", partner: "CityPress Laundry", rating: 1, text: "Order never arrived and nobody called me back. Very disappointed.", date: "25 Nov", status: "flagged" },
  { id: "rv-4", customer: "Tanmay Sethi", partner: "SmartWash Laundry", rating: 5, text: "Been using them for 6 months — always on time.", date: "24 Nov", status: "published" },
  { id: "rv-5", customer: "Lipsa Das", partner: "CleanCare Laundry", rating: 3, text: "Dry cleaning was fine but expensive compared to others.", date: "23 Nov", status: "pending" },
  { id: "rv-6", customer: "Soumya Kar", partner: "CleanCare Laundry", rating: 2, text: "Stain on my kurta was not removed.", date: "22 Nov", status: "pending" },
];

export const ACTIVITY = [
  { id: "a1", who: "Rakesh (you)", what: "approved FreshWash Laundry payout", when: "2 min ago", tone: "blue" },
  { id: "a2", who: "SmartWash Laundry", what: "marked order BB-2837 delivered", when: "18 min ago", tone: "emerald" },
  { id: "a3", who: "Sneha Patel", what: "paid ₹320 via UPI for BB-2839", when: "42 min ago", tone: "orange" },
  { id: "a4", who: "Suds & Shine Hub", what: "submitted partner verification docs", when: "1 hr ago", tone: "violet" },
  { id: "a5", who: "System", what: "auto-cancelled BB-2835 after 3 failed pickups", when: "3 hrs ago", tone: "red" },
  { id: "a6", who: "Meera Behera", what: "raised a complaint on CityPress Laundry", when: "5 hrs ago", tone: "red" },
];

export const SETTINGS = {
  platformName: "BB LaundryLink",
  city: "Bhubaneswar",
  commission: 12,
  pickupFee: 0,
  freePickupAbove: 199,
  cancelWindow: 15,
  supportPhone: "1800 102 4455",
  supportEmail: "care@bbll.in",
  autoApprovePartners: false,
  sendOrderSms: true,
  sendOfferPush: true,
};

export const STATUS_TONE = {
  active: "emerald",
  published: "emerald",
  verified: "emerald",
  paid: "emerald",
  delivered: "emerald",
  pending: "amber",
  placed: "blue",
  new: "amber",
  confirmed: "blue",
  "in wash": "orange",
  packed: "violet",
  ready: "violet",
  "picked up": "sky",
  blocked: "red",
  suspended: "red",
  cancelled: "red",
  "on-hold": "red",
  flagged: "red",
  refunded: "slate",
  "percent off": "orange",
};

export const STATUS_LABEL = {
  "on-hold": "On hold",
};

// ---------------------------------------------------------------------------
// Deterministic demo chart series (no Math.random so the chart never jumps)
// ---------------------------------------------------------------------------
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function makeSeries(seed, count, base, drift) {
  const rand = seeded(seed);
  const out = [];
  let value = base;
  for (let i = 0; i < count; i += 1) {
    value = Math.max(base * 0.45, value + (rand() - 0.42) * base * 0.16 + drift);
    out.push(Math.round(value));
  }
  return out;
}

export const REVENUE_SERIES = {
  "7D": { labels: ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"], data: makeSeries(7, 7, 38000, 900), compare: makeSeries(77, 7, 33000, 500) },
  "30D": { labels: ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28"], data: makeSeries(30, 10, 34000, 1600), compare: makeSeries(303, 10, 29000, 900) },
  "90D": { labels: ["Sep", "Oct", "Nov"], data: makeSeries(90, 12, 28000, 2600), compare: makeSeries(909, 12, 24000, 1400) },
};

export const SERVICE_MIX = [
  { name: "Wash & Fold", pct: 46, tone: "blue" },
  { name: "Dry Cleaning", pct: 24, tone: "sky" },
  { name: "Ironing", pct: 19, tone: "orange" },
  { name: "Shoe Care", pct: 11, tone: "emerald" },
];

export const KPIS = [
  { id: "orders", label: "Total orders", value: 1284, delta: 12.4, icon: "package", tone: "blue", spark: makeSeries(11, 12, 60, 1.4) },
  { id: "partners", label: "Active partners", value: 120, delta: 4.1, icon: "store", tone: "orange", spark: makeSeries(12, 12, 40, 0.8), suffix: "" },
  { id: "customers", label: "Customers", value: 12430, delta: 8.7, icon: "users", tone: "emerald", spark: makeSeries(13, 12, 200, 8) },
  { id: "revenue", label: "Revenue", value: 420000, delta: 18.2, icon: "rupee", tone: "violet", spark: makeSeries(14, 12, 500, 12), currency: true },
];
