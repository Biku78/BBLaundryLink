// Local admin "database". Every mutation is persisted to localStorage so the
// admin console survives a page refresh.
//
// When the Go backend exposes admin endpoints, only the `persist`/`load` pair
// (and the exported action bodies) need to change to `fetch` calls — the UI in
// designs/AdminDesign.jsx does not read storage directly.

import {
  PARTNERS, ORDERS, CUSTOMERS, COUPONS, SETTLEMENTS, REVIEWS, SERVICES,
  ACTIVITY, SETTINGS, ORDER_PIPELINE,
} from "../data/adminData";

const STORAGE_KEY = "bbll:admin:v1";

const SEED = () => ({
  partners: PARTNERS,
  orders: ORDERS,
  customers: CUSTOMERS,
  coupons: COUPONS,
  settlements: SETTLEMENTS,
  reviews: REVIEWS,
  services: SERVICES,
  activity: ACTIVITY,
  settings: SETTINGS,
  seq: 2900,
});

const listeners = new Set();
let db = load();

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED();
    const parsed = JSON.parse(raw);
    // Guard against an older/partial shape: fall back per-key.
    const seed = SEED();
    return {
      ...seed,
      ...parsed,
      settings: { ...seed.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return SEED();
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage may be full or disabled — state still lives in memory */
  }
  listeners.forEach((fn) => fn(db));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return db;
}

function commit(next, activity) {
  db = {
    ...next,
    activity: activity
      ? [{ id: `a-${Date.now()}`, when: "just now", ...activity }, ...next.activity].slice(0, 40)
      : next.activity,
  };
  persist();
  return db;
}

function stamp() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ---------------------------------------------------------------- partners --
export const adminActions = {
  approvePartner(id) {
    const partner = db.partners.find((p) => p.id === id);
    if (!partner) return;
    commit(
      {
        ...db,
        partners: db.partners.map((p) =>
          p.id === id ? { ...p, status: "active", docs: "verified", payout: "Weekly · every Monday" } : p,
        ),
      },
      { who: "You", what: `approved ${partner.name} as a laundry partner`, tone: "emerald" },
    );
  },

  rejectPartner(id, reason = "Documents incomplete") {
    const partner = db.partners.find((p) => p.id === id);
    if (!partner) return;
    commit(
      {
        ...db,
        partners: db.partners.map((p) =>
          p.id === id ? { ...p, status: "suspended", note: reason } : p,
        ),
      },
      { who: "You", what: `rejected ${partner.name} — ${reason}`, tone: "red" },
    );
  },

  suspendPartner(id, reason = "Suspended by admin") {
    const partner = db.partners.find((p) => p.id === id);
    if (!partner) return;
    const suspended = partner.status === "suspended";
    commit(
      {
        ...db,
        partners: db.partners.map((p) =>
          p.id === id ? { ...p, status: suspended ? "active" : "suspended", note: suspended ? "" : reason } : p,
        ),
      },
      {
        who: "You",
        what: `${suspended ? "reactivated" : "suspended"} ${partner.name}`,
        tone: suspended ? "emerald" : "red",
      },
    );
  },

  updatePartner(id, patch) {
    commit({ ...db, partners: db.partners.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  },

  // ----------------------------------------------------------------- orders --
  advanceOrder(id) {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return;
    const at = ORDER_PIPELINE.indexOf(order.status);
    if (at < 0 || at >= ORDER_PIPELINE.length - 1) return;
    const next = ORDER_PIPELINE[at + 1];
    commit(
      { ...db, orders: db.orders.map((o) => (o.id === id ? { ...o, status: next } : o)) },
      { who: "You", what: `moved order ${id} to ${next}`, tone: "blue" },
    );
  },

  cancelOrder(id) {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return;
    commit(
      { ...db, orders: db.orders.map((o) => (o.id === id ? { ...o, status: "Cancelled", payment: "Refunded" } : o)) },
      { who: "You", what: `cancelled order ${id} and queued a refund`, tone: "red" },
    );
  },

  assignPartner(id, partnerName) {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return;
    commit(
      { ...db, orders: db.orders.map((o) => (o.id === id ? { ...o, partner: partnerName } : o)) },
      { who: "You", what: `reassigned order ${id} to ${partnerName}`, tone: "orange" },
    );
  },

  newOrder({ customer, partner, service, qty, amount }) {
    const seq = db.seq + 1;
    const id = `BB-${seq}`;
    const order = {
      id, customer, partner, service, qty,
      amount: Number(amount) || 0,
      status: "Placed",
      payment: "Cash",
      placed: `Today, ${stamp()}`,
      slot: "Pickup next slot",
      area: "Bhubaneswar",
    };
    commit({ ...db, seq, orders: [order, ...db.orders] }, { who: "You", what: `created booking ${id} for ${customer}`, tone: "blue" });
    return id;
  },

  // -------------------------------------------------------------- customers --
  toggleCustomerBlock(id) {
    const customer = db.customers.find((c) => c.id === id);
    if (!customer) return;
    const blocked = customer.status === "blocked";
    commit(
      {
        ...db,
        customers: db.customers.map((c) => (c.id === id ? { ...c, status: blocked ? "active" : "blocked" } : c)),
      },
      { who: "You", what: `${blocked ? "unblocked" : "blocked"} customer ${customer.name}`, tone: blocked ? "emerald" : "red" },
    );
  },

  creditWallet(id, amount) {
    const customer = db.customers.find((c) => c.id === id);
    if (!customer || !amount) return;
    commit(
      { ...db, customers: db.customers.map((c) => (c.id === id ? { ...c, wallet: c.wallet + Number(amount) } : c)) },
      { who: "You", what: `credited ₹${amount} to ${customer.name}'s wallet`, tone: "violet" },
    );
  },

  // ---------------------------------------------------------------- services --
  toggleService(id) {
    const service = db.services.find((s) => s.id === id);
    if (!service) return;
    commit(
      { ...db, services: db.services.map((s) => (s.id === id ? { ...s, active: !s.active } : s)) },
      { who: "You", what: `${service.active ? "paused" : "activated"} ${service.name}`, tone: service.active ? "amber" : "emerald" },
    );
  },

  updatePrice(id, price) {
    const service = db.services.find((s) => s.id === id);
    if (!service) return;
    const value = Math.max(0, Number(price) || 0);
    commit(
      { ...db, services: db.services.map((s) => (s.id === id ? { ...s, price: value } : s)) },
      { who: "You", what: `set ${service.name} price to ₹${value} ${service.unit}`, tone: "orange" },
    );
  },

  // ----------------------------------------------------------------- coupons --
  toggleCoupon(id) {
    const coupon = db.coupons.find((c) => c.id === id);
    if (!coupon) return;
    commit(
      { ...db, coupons: db.coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c)) },
      { who: "You", what: `${coupon.active ? "paused" : "enabled"} coupon ${coupon.code}`, tone: coupon.active ? "amber" : "emerald" },
    );
  },

  saveCoupon(input) {
    const coupon = {
      id: `cp-${Date.now()}`,
      code: String(input.code || "").toUpperCase().replace(/\s+/g, ""),
      title: input.title || "Untitled offer",
      type: input.type || "flat",
      value: Number(input.value) || 0,
      maxDiscount: Number(input.maxDiscount) || 0,
      minOrder: Number(input.minOrder) || 0,
      uses: 0,
      limit: Number(input.limit) || 100,
      active: true,
      expires: input.expires || "2027-12-31",
    };
    commit({ ...db, coupons: [coupon, ...db.coupons] }, { who: "You", what: `created coupon ${coupon.code}`, tone: "orange" });
  },

  deleteCoupon(id) {
    const coupon = db.coupons.find((c) => c.id === id);
    commit({ ...db, coupons: db.coupons.filter((c) => c.id !== id) }, { who: "You", what: `deleted coupon ${coupon?.code || id}`, tone: "red" });
  },

  // ------------------------------------------------------------- settlements --
  paySettlement(id) {
    const settlement = db.settlements.find((s) => s.id === id);
    if (!settlement) return;
    commit(
      {
        ...db,
        settlements: db.settlements.map((s) =>
          s.id === id ? { ...s, status: "paid", date: `Released ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}` } : s,
        ),
      },
      { who: "You", what: `released ₹${settlement.payout.toLocaleString("en-IN")} to ${settlement.partner}`, tone: "emerald" },
    );
  },

  holdSettlement(id) {
    const settlement = db.settlements.find((s) => s.id === id);
    if (!settlement) return;
    commit(
      {
        ...db,
        settlements: db.settlements.map((s) => (s.id === id ? { ...s, status: s.status === "on-hold" ? "pending" : "on-hold", date: s.status === "on-hold" ? "Released for review" : "Held by admin" } : s)),
      },
      { who: "You", what: `${settlement.status === "on-hold" ? "released" : "held"} payout ${id}`, tone: "amber" },
    );
  },

  // ----------------------------------------------------------------- reviews --
  setReviewStatus(id, status) {
    const review = db.reviews.find((r) => r.id === id);
    if (!review) return;
    const labels = { published: "published", hidden: "hidden", pending: "sent to moderation", flagged: "flagged" };
    commit(
      { ...db, reviews: db.reviews.map((r) => (r.id === id ? { ...r, status } : r)) },
      { who: "You", what: `${labels[status] || status} review from ${review.customer}`, tone: status === "hidden" ? "red" : "emerald" },
    );
  },

  // ---------------------------------------------------------------- settings --
  saveSettings(patch) {
    commit({ ...db, settings: { ...db.settings, ...patch } }, { who: "You", what: "updated platform settings", tone: "blue" });
  },

  resetDemoData() {
    db = SEED();
    persist();
    return db;
  },
};

// ------------------------------------------------------------------ helpers --
export function inr(value, compact = false) {
  if (compact && value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (compact && value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}
