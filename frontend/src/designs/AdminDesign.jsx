import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Package, Store, Users, BadgePercent, Wallet, Star, Settings, Search, Bell, LogOut, ChevronDown, ArrowRight, ShieldCheck, CircleCheck, Truck, SlidersHorizontal, Ban, PackageCheck } from "lucide-react";
import { adminActions, inr, subscribe, getSnapshot } from "../services/adminApi";
import { ORDER_PIPELINE } from "../data/adminData";
import { logout } from "../features/auth/authSlice";
import { api } from "../services/api";
import { Pill, StatusPill, Btn, Sheet, Toast } from "./AdminUI";
import { CHIP } from "./adminTones";
import { OverviewPanel, OrdersPanel, PartnersPanel, CustomersPanel, ServicesPanel, OffersPanel, PaymentsPanel, ReviewsPanel, SettingsPanel } from "./AdminPanels";
import "./admin.css";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "orders", label: "Orders", icon: Package },
  { id: "partners", label: "Partners", icon: Store },
  { id: "customers", label: "Customers", icon: Users },
  { id: "services", label: "Services", icon: SlidersHorizontal },
  { id: "offers", label: "Offers", icon: BadgePercent },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

const DOCK = ["overview", "orders", "partners", "customers", "settings"];

export default function AdminDashboard() {
  const account = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const db = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);

  const admin = useMemo(() => {
    const name = account?.Name || account?.name || "Rakesh Panda";
    const email = account?.Email || account?.email || "admin@bbll.in";
    return { name, email, role: "Super admin" };
  }, [account]);

  const notify = (message) => { setToast(message); window.clearTimeout(notify._t); notify._t = window.setTimeout(() => setToast(""), 3000); };

  const signOut = () => { dispatch(logout()); dispatch(api.util.resetApiState()); navigate("/login"); };

  const pendingPartners = db.partners.filter((p) => p.status === "pending").length;
  const flaggedReviews = db.reviews.filter((r) => r.status === "flagged").length;
  const liveOrders = db.orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length;
  const badgeFor = { partners: pendingPartners, reviews: flaggedReviews, orders: liveOrders };

  // Global search: jumps to the right panel with the term pre-filled
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;
    if (/^bb-?\d/i.test(term) || /order|deliver/i.test(term)) { setTab("orders"); notify(`Showing orders matching “${term}”`); return; }
    if (/partner|laundry|hub|studio/i.test(term)) { setTab("partners"); notify(`Showing partners matching “${term}”`); return; }
    setTab("customers"); notify(`Showing customers matching “${term}”`);
  };

  const go = (id) => { setTab(id); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const notifications = [
    { icon: Store, tone: "amber", t: `${pendingPartners} partner applications pending`, s: "Verify documents to go live", to: "partners" },
    { icon: Truck, tone: "blue", t: `${liveOrders} orders in the pipeline`, s: "Move them to the next stage", to: "orders" },
    { icon: Star, tone: "red", t: `${flaggedReviews} review flagged`, s: "CityPress Laundry · 1-star", to: "reviews" },
    { icon: Wallet, tone: "emerald", t: "Payout due today", s: "CleanCare Laundry · ₹16,016", to: "payments" },
  ];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setNotifOpen(false); setAdminOpen(false); setDetailOrder(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const panel = {
    overview: <OverviewPanel db={db} go={go} notify={notify} openOrder={setDetailOrder} adminName={admin.name} />,
    orders: <OrdersPanel db={db} notify={notify} openOrder={setDetailOrder} />,
    partners: <PartnersPanel db={db} notify={notify} />,
    customers: <CustomersPanel db={db} notify={notify} />,
    services: <ServicesPanel db={db} notify={notify} />,
    offers: <OffersPanel db={db} notify={notify} />,
    payments: <PaymentsPanel db={db} notify={notify} />,
    reviews: <ReviewsPanel db={db} notify={notify} />,
    settings: <SettingsPanel db={db} notify={notify} />,
  }[tab];

  return (
    <div className="min-h-screen bg-[#EEF6FF] overflow-x-hidden pb-32">
      {/* Background decor — same language as the customer view */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute top-[38%] -left-40 w-[420px] h-[420px] rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[380px] h-[380px] rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* ============ FLOATING PILL NAVBAR ============ */}
      <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-50 max-w-7xl mx-auto">
        <div className="glass rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-white/70 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          <button onClick={() => go("overview")} className="flex items-center gap-2.5 shrink-0" aria-label="BB LaundryLink admin home">
            <img src="/images/logo.webp" alt="BB LaundryLink" className="preserved-brand" />
          </button>

          <nav className="hidden lg:flex items-center gap-1 bg-white/70 rounded-full p-1 border border-slate-100">
            {NAV.slice(0, 5).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`relative px-3.5 py-2 rounded-full text-[13px] font-bold transition ${tab === id ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-900"}`}
              >
                {label}
                {badgeFor[id] ? <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black align-middle">{badgeFor[id]}</span> : null}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <form onSubmit={onSearchSubmit} className="hidden md:flex items-center gap-1.5 bg-white border border-slate-200 rounded-full pl-3 pr-1 py-1.5 w-56 xl:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, partners…"
                className="w-full bg-transparent outline-none text-xs font-semibold placeholder:text-slate-400"
                aria-label="Search admin data"
              />
              <button type="submit" className="bg-slate-900 text-white rounded-full px-2.5 py-1 text-[10px] font-black shrink-0">Go</button>
            </form>

            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-blue-300 transition"
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {pendingPartners + flaggedReviews}
                </span>
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute right-0 top-12 w-80 max-w-[86vw] bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <p className="font-display font-black text-sm px-2 py-1.5">Admin alerts</p>
                    {notifications.map((n, i) => (
                      <button key={i} onClick={() => { go(n.to); setNotifOpen(false); }} className="w-full text-left flex gap-3 p-2.5 rounded-2xl hover:bg-slate-50">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${CHIP[n.tone] || CHIP.blue}`}><n.icon className="w-4 h-4" /></span>
                        <span className="min-w-0"><span className="block text-xs font-black text-slate-900">{n.t}</span><span className="block text-[11px] font-semibold text-slate-500 truncate">{n.s}</span></span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setAdminOpen((v) => !v)}
                className="flex items-center gap-2 bg-slate-900 text-white rounded-full pl-1 pr-3 py-1 hover:bg-slate-800 transition"
                aria-expanded={adminOpen}
              >
                <img src="/images/avatar-sample.webp" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                <span className="text-xs font-bold hidden sm:block max-w-[90px] truncate">{admin.name.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              <AnimatePresence>
                {adminOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute right-0 top-12 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <div className="flex items-center gap-2.5 p-2">
                      <img src="/images/avatar-sample.webp" alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{admin.name}</p>
                        <p className="text-[10px] font-semibold text-slate-500 truncate">{admin.email}</p>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1 px-2 pb-2">
                      <Pill tone="amber"><ShieldCheck className="w-3 h-3" /> {admin.role}</Pill>
                      <Pill tone="blue"><CircleCheck className="w-3 h-3" /> 2FA on</Pill>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      {NAV.slice(5).map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => { go(id); setAdminOpen(false); }} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                          <Icon className="w-4 h-4" /> {label}
                        </button>
                      ))}
                      <button onClick={signOut} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-black text-red-500 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> ADMIN MODE · CHANGES YOU MAKE APPLY INSTANTLY
          </span>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 pt-[118px] sm:pt-[128px]">
        {/* Compact panel switcher for tablet / mobile */}
        <div className="lg:hidden mb-3 -mx-1 px-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-black border whitespace-nowrap transition ${tab === id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"}`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
                {badgeFor[id] ? <span className="bg-red-500 text-white text-[9px] px-1 rounded-full">{badgeFor[id]}</span> : null}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {panel}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-[11px] font-semibold text-slate-400 mt-6 px-4">
          Admin console · sample data stored in this browser · approvals, pricing and payouts are simulated until the admin API is connected
        </p>
      </main>

      {/* ============ BOTTOM FLOATING DOCK ============ */}
      <nav aria-label="Admin navigation" className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto glass-dark rounded-full shadow-[0_20px_50px_rgba(15,23,42,0.45)] border border-white/10 p-1.5 flex items-center gap-1">
          {DOCK.map((id) => {
            const item = NAV.find((n) => n.id === id);
            const active = tab === id;
            const Icon = item.icon;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className="relative flex flex-col items-center gap-0.5 px-3 sm:px-5 py-2 rounded-full transition"
              >
                {active && <motion.span layoutId="admin-dock-active" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className="relative z-10 flex items-center gap-1">
                  <Icon className={`w-5 h-5 ${active ? "text-slate-900" : "text-slate-300"}`} />
                  {badgeFor[id] ? <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{badgeFor[id]}</span> : null}
                </span>
                <span className={`relative z-10 text-[10px] font-black ${active ? "text-slate-900" : "text-slate-400"}`}>{item.label}</span>
              </button>
            );
          })}
          <span className="w-px h-8 bg-white/15 mx-1" />
          <button onClick={signOut} aria-label="Logout" className="relative flex flex-col items-center gap-0.5 px-3 sm:px-5 py-2 rounded-full bg-white hover:bg-red-50 transition">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-[10px] font-black text-red-400">Logout</span>
          </button>
        </div>
      </nav>

      {/* ============ ORDER DETAIL SHEET ============ */}
      <Sheet open={!!detailOrder} onClose={() => setDetailOrder(null)} title={detailOrder ? `Order ${detailOrder.id}` : ""} sub={detailOrder ? `${detailOrder.customer} · ${detailOrder.placed}` : ""}>
        {detailOrder && (() => {
          const live = db.orders.find((o) => o.id === detailOrder.id) || detailOrder;
          const at = ORDER_PIPELINE.indexOf(live.status);
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <StatusPill status={live.status} />
                <p className="font-display font-black text-2xl text-slate-900">{inr(live.amount)}</p>
              </div>

              {/* Pipeline stepper */}
              {at >= 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Pipeline</p>
                  <div className="flex items-center gap-1">
                    {ORDER_PIPELINE.map((step, i) => (
                      <div key={step} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`w-full h-1.5 rounded-full ${i <= at ? "bg-gradient-to-r from-blue-600 to-sky-500" : "bg-slate-200"}`} />
                        <span className={`text-[9px] font-black ${i <= at ? "text-blue-700" : "text-slate-400"}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {[["Customer", live.customer], ["Partner", live.partner], ["Service", `${live.service} · ${live.qty}`], ["Area", live.area], ["Payment", live.payment], ["Slot", live.slot]].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{k}</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reassign partner</p>
                <div className="flex flex-wrap gap-1.5">
                  {db.partners.filter((p) => p.status === "active").map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { adminActions.assignPartner(live.id, p.name); notify(`${live.id} reassigned to ${p.name}`); }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-black border ${live.partner === p.name ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {at >= 0 && at < ORDER_PIPELINE.length - 1 && (
                  <Btn className="flex-1" onClick={() => { adminActions.advanceOrder(live.id); notify(`${live.id} → ${ORDER_PIPELINE[at + 1]}`); }}>
                    <ArrowRight className="w-4 h-4" /> Mark {ORDER_PIPELINE[at + 1]}
                  </Btn>
                )}
                {!["Delivered", "Cancelled"].includes(live.status) && (
                  <Btn variant="danger" onClick={() => { adminActions.cancelOrder(live.id); notify(`${live.id} cancelled · refund queued`); }}>
                    <Ban className="w-4 h-4" /> Cancel & refund
                  </Btn>
                )}
                <Btn variant="ghost" onClick={() => { navigate("/dashboard"); }}>
                  <PackageCheck className="w-4 h-4" /> Customer view
                </Btn>
              </div>
            </div>
          );
        })()}
      </Sheet>

      <Toast message={toast} />
    </div>
  );
}
