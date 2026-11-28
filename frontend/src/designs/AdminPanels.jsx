import { useMemo, useState } from "react";
import { Search, Package, Store, Users, BadgePercent, Wallet, Star, Check, X, ChevronRight, ArrowRight, TrendingUp, TrendingDown, ShieldCheck, CircleCheck, Clock, MapPin, Download, Eye, Plus, Trash2, RefreshCw, AlertCircle, Ban, Play, Pause, Receipt, Activity, IndianRupee, Bike, Zap, Shirt, WashingMachine, Footprints, Gem, Copy, CircleDollarSign, Save, XCircle, Star as StarIcon } from "lucide-react";
import { Card, Pill, StatusPill, Btn, SectionHead, Sparkline, AreaChart, Progress, Field, TextInput, Select, Toggle, EmptyState, Sheet } from "./AdminUI";
import { CHIP, DOT } from "./adminTones";
import { adminActions, inr, toCsv } from "../services/adminApi";
import { REVENUE_SERIES, SERVICE_MIX, KPIS, ORDER_PIPELINE } from "../data/adminData";

const SERVICE_ICON = {
  "Wash & Fold": WashingMachine, "Dry Cleaning": Shirt, Ironing: Zap,
  "Shoe Care": Footprints, "Premium Care": Gem, "Pickup & Delivery": Bike,
};
const TONE_BY_INDEX = ["blue", "sky", "orange", "emerald", "violet"];

function timeGreeting(name) {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${part} ${(name || "Admin").split(" ")[0]} ✦`;
}

/* =============================================================== OVERVIEW == */
export function OverviewPanel({ db, go, notify, openOrder, adminName }) {
  const [range, setRange] = useState("30D");
  const pendingPartners = db.partners.filter((p) => p.status === "pending");
  const liveOrders = db.orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).slice(0, 5);
  const todayRevenue = db.orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-4">
      {/* Welcome hero */}
      <Card className="relative overflow-hidden" pad="p-5 sm:p-8">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-sky-100 blur-2xl" />
        <div className="absolute right-28 top-8 w-10 h-10 rounded-full border-2 border-sky-200 animate-bubble hidden sm:block" />
        <div className="absolute right-44 top-20 w-5 h-5 rounded-full bg-orange-200 animate-bubble hidden sm:block" style={{ animationDelay: ".6s" }} />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Pill tone="amber"><ShieldCheck className="w-3 h-3" /> Admin console</Pill>
            <Pill tone="blue"><CircleCheck className="w-3 h-3" /> Full access</Pill>
            <Pill tone="emerald"><Activity className="w-3 h-3" /> Live sync</Pill>
          </div>
          <h1 className="font-display font-black text-[30px] sm:text-[46px] leading-[0.98] tracking-tight text-slate-900">
            {timeGreeting(adminName)}<br />
            <span className="text-gradient-blue">You control the platform.</span><br />
            <span className="text-gradient-orange">{inr(todayRevenue, true)} booked today</span>
          </h1>
          <p className="mt-3 text-slate-600 font-medium text-sm max-w-lg">
            {db.settings.city} region · {db.partners.filter((p) => p.status === "active").length} active partners ·{" "}
            {liveOrders.length} orders in progress · {pendingPartners.length} partner applications waiting for review.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn onClick={() => go("partners")}><ShieldCheck className="w-4 h-4" /> Review {pendingPartners.length} partners</Btn>
            <Btn variant="ghost" onClick={() => go("orders")}><Package className="w-4 h-4" /> Open order desk</Btn>
            <Btn variant="ghost" onClick={() => go("offers")}><BadgePercent className="w-4 h-4" /> Manage offers</Btn>
          </div>
        </div>
      </Card>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => {
          const first = i === 0;
          const IconCmp = { package: Package, store: Store, users: Users, rupee: IndianRupee }[kpi.icon] || Package;
          const up = kpi.delta >= 0;
          return (
            <div
              key={kpi.id}
              className={first
                ? "rounded-[28px] p-5 text-white bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 shadow-[0_18px_45px_rgba(37,99,235,0.35)] relative overflow-hidden"
                : "bg-white rounded-[28px] border border-white shadow-[0_16px_50px_rgba(37,99,235,0.10)] p-5"}
            >
              {first && <div className="absolute -right-6 -bottom-8 w-28 h-28 rounded-full bg-white/10" />}
              <div className="flex items-start justify-between gap-2 relative">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-wider ${first ? "text-white/70" : "text-slate-400"}`}>{kpi.label}</p>
                  <p className={`font-display font-black mt-1.5 leading-none ${first ? "text-3xl sm:text-[34px]" : "text-2xl sm:text-3xl text-slate-900"}`}>
                    {kpi.currency ? inr(kpi.value, true) : kpi.value.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${first ? "bg-white/15 text-white" : (CHIP[kpi.tone] || CHIP.blue)}`}>
                  <IconCmp className="w-5 h-5" />
                </span>
              </div>
              <div className="flex items-end justify-between gap-3 mt-3 relative">
                <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full ${first ? "bg-white/20 text-white" : up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {up ? "+" : ""}{kpi.delta}%
                </span>
                <div className={`w-20 ${first ? "opacity-90" : ""}`}>
                  <Sparkline data={kpi.spark} tone={first ? "white" : kpi.tone} height={26} />
                </div>
              </div>
              <p className={`text-[10px] font-semibold mt-1 ${first ? "text-white/60" : "text-slate-400"}`}>vs last week</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-8">
          <SectionHead
            title="Revenue this month"
            sub={`Total ${inr(REVENUE_SERIES[range].data.reduce((a, b) => a + b, 0), true)} · ${db.settings.commission}% platform commission`}
            right={
              <div className="flex bg-slate-100 rounded-full p-1">
                {["7D", "30D", "90D"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black transition ${range === r ? "bg-slate-900 text-white shadow" : "text-slate-500"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            }
          />
          <div className="mt-4"><AreaChart series={REVENUE_SERIES[range]} /></div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="text-[11px] font-black text-slate-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> This period</span>
            <span className="text-[11px] font-black text-slate-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> Previous period</span>
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <SectionHead title="Orders by service" sub="Last 30 days" />
          <div className="mt-5 space-y-4">
            {SERVICE_MIX.map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-slate-700">{s.name}</span>
                  <span className="text-[11px] font-black text-slate-500">{s.pct}%</span>
                </div>
                <Progress pct={s.pct} tone={TONE_BY_INDEX[i % TONE_BY_INDEX.length]} />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg order value</p>
              <p className="font-display font-black text-xl text-slate-900">₹186</p>
            </div>
            <Btn size="sm" variant="soft" onClick={() => go("services")}>Pricing <ArrowRight className="w-3 h-3" /></Btn>
          </div>
        </Card>
      </div>

      {/* Queue + live orders */}
      <div className="grid lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7">
          <SectionHead
            title="Partner approval queue"
            sub="Verify documents, then approve to go live"
            right={<Pill tone="amber">{pendingPartners.length} pending</Pill>}
          />
          <div className="mt-3 divide-y divide-slate-100">
            {pendingPartners.length === 0 && <EmptyState title="Queue is clear" sub="All partner applications have been reviewed." icon={CircleCheck} />}
            {pendingPartners.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                <img src={p.img} alt="" className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-black text-sm text-slate-900 truncate">{p.name}</p>
                  <p className="text-[11px] font-semibold text-slate-500 truncate flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.area}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Applied {p.joined} · {p.services.join(", ")}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Btn size="sm" variant="ghost" onClick={() => { adminActions.rejectPartner(p.id); notify(`Rejected ${p.name}`); }}>
                    <X className="w-3 h-3" /> Reject
                  </Btn>
                  <Btn size="sm" onClick={() => { adminActions.approvePartner(p.id); notify(`${p.name} approved and live`); }}>
                    <Check className="w-3 h-3" /> Approve
                  </Btn>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => go("partners")} className="mt-2 text-[11px] font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
            All partners <ChevronRight className="w-3 h-3" />
          </button>
        </Card>

        <Card className="lg:col-span-5">
          <SectionHead title="Live orders" right={<Pill tone="blue">{liveOrders.length} active</Pill>} />
          <div className="mt-3 space-y-2">
            {liveOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => openOrder(o)}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-black text-xs text-slate-900">{o.id} · {o.customer}</p>
                  <span className="text-[11px] font-black text-slate-700">{inr(o.amount)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <StatusPill status={o.status} />
                  <span className="text-[10px] font-bold text-slate-400">{o.partner.split(" ")[0]}</span>
                </div>
              </button>
            ))}
            {liveOrders.length === 0 && <EmptyState title="No live orders" sub="New bookings will appear here instantly." />}
          </div>
          <button onClick={() => go("orders")} className="mt-3 text-[11px] font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
            Full order desk <ChevronRight className="w-3 h-3" />
          </button>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <SectionHead title="Live activity" sub="Everything happening across the platform" right={<Pill tone="emerald"><Activity className="w-3 h-3" /> realtime</Pill>} />
        <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {db.activity.slice(0, 6).map((a) => (
            <div key={a.id} className="flex gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className={`w-1.5 rounded-full shrink-0 ${DOT[a.tone] || DOT.slate}`} />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-700 leading-snug"><b className="text-slate-900">{a.who}</b> {a.what}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {a.when}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================= ORDERS == */
export function OrdersPanel({ db, notify, openOrder }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", partner: db.partners[0]?.name || "", service: "Wash & Fold", qty: "3 kg", amount: "" });

  const statuses = ["all", ...ORDER_PIPELINE, "Cancelled"];
  const rows = useMemo(() => db.orders.filter((o) => {
    const matchQ = `${o.id} ${o.customer} ${o.partner} ${o.service}`.toLowerCase().includes(q.toLowerCase());
    const matchS = status === "all" || o.status === status;
    return matchQ && matchS;
  }), [db.orders, q, status]);

  const exportCsv = () => {
    const csv = toCsv(rows.map(({ id, customer, partner, service, qty, amount, status, payment, placed }) =>
      ({ id, customer, partner, service, qty, amount, status, payment, placed })));
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "bb-laundrylink-orders.csv"; a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${rows.length} orders to CSV`);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.customer.trim() || !form.amount) return notify("Customer name and amount are required");
    const id = adminActions.newOrder(form);
    setNewOpen(false);
    setForm({ customer: "", partner: db.partners[0]?.name || "", service: "Wash & Fold", qty: "3 kg", amount: "" });
    notify(`Booking ${id} created for ${form.customer}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <SectionHead
          title="Order desk"
          sub="Move orders through the pipeline, reassign partners, issue refunds"
          right={
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" onClick={exportCsv}><Download className="w-3.5 h-3.5" /> CSV</Btn>
              <Btn size="sm" onClick={() => setNewOpen(true)}><Plus className="w-3.5 h-3.5" /> New booking</Btn>
            </div>
          }
        />
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order id, customer, partner…" className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-slate-400" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`whitespace-nowrap px-3 py-2 rounded-full text-[11px] font-black border transition ${status === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {rows.length === 0 && <EmptyState title="No matching orders" sub="Try a different search or status filter." />}
          {rows.map((o) => {
            const at = ORDER_PIPELINE.indexOf(o.status);
            const canAdvance = at >= 0 && at < ORDER_PIPELINE.length - 1;
            return (
              <div key={o.id} className="p-3 sm:p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Package className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-sm text-slate-900">{o.id}</p>
                      <StatusPill status={o.status} />
                      <Pill tone="slate">{o.payment}</Pill>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600 mt-0.5 truncate">{o.customer} · {o.service} · {o.qty}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{o.partner} · {o.area} · {o.placed}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-black text-lg text-slate-900 leading-none">{inr(o.amount)}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{o.slot}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  <Btn size="sm" variant="ghost" onClick={() => openOrder(o)}><Eye className="w-3 h-3" /> Details</Btn>
                  {canAdvance && (
                    <Btn size="sm" variant="soft" onClick={() => { adminActions.advanceOrder(o.id); notify(`${o.id} → ${ORDER_PIPELINE[at + 1]}`); }}>
                      <ArrowRight className="w-3 h-3" /> Mark {ORDER_PIPELINE[at + 1]}
                    </Btn>
                  )}
                  {!["Delivered", "Cancelled"].includes(o.status) && (
                    <Btn size="sm" variant="danger" onClick={() => { adminActions.cancelOrder(o.id); notify(`${o.id} cancelled · refund queued`); }}>
                      <XCircle className="w-3 h-3" /> Cancel & refund
                    </Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Sheet open={newOpen} onClose={() => setNewOpen(false)} title="Create booking" sub="Manual booking on behalf of a customer">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Customer name"><TextInput required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="e.g. Ritika Sahoo" /></Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Partner">
              <Select value={form.partner} onChange={(e) => setForm({ ...form, partner: e.target.value })}>
                {db.partners.filter((p) => p.status === "active").map((p) => <option key={p.id}>{p.name}</option>)}
              </Select>
            </Field>
            <Field label="Service">
              <Select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                {db.services.filter((s) => s.active).map((s) => <option key={s.id}>{s.name}</option>)}
              </Select>
            </Field>
            <Field label="Quantity"><TextInput value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="3 kg / 2 pcs" /></Field>
            <Field label="Amount (₹)"><TextInput required type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="150" /></Field>
          </div>
          <div className="flex gap-2 pt-1">
            <Btn variant="ghost" type="button" onClick={() => setNewOpen(false)} className="flex-1">Cancel</Btn>
            <Btn type="submit" className="flex-1"><Check className="w-4 h-4" /> Create booking</Btn>
          </div>
        </form>
      </Sheet>
    </div>
  );
}

/* =============================================================== PARTNERS == */
export function PartnersPanel({ db, notify }) {
  const [filter, setFilter] = useState("pending");
  const [active, setActive] = useState(null);
  const [commission, setCommission] = useState("");

  const counts = {
    pending: db.partners.filter((p) => p.status === "pending").length,
    active: db.partners.filter((p) => p.status === "active").length,
    suspended: db.partners.filter((p) => p.status === "suspended").length,
    all: db.partners.length,
  };
  const list = db.partners.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="space-y-4">
      <Card>
        <SectionHead title="Partners" sub="Approve, suspend and set commission for every laundry partner" />
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[
            { id: "pending", label: "Pending" },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended" },
            { id: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2 rounded-full text-[11px] font-black border transition ${filter === f.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}
            >
              {f.label} <span className="opacity-60">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.length === 0 && <div className="md:col-span-2 xl:col-span-3"><EmptyState title="Nothing here" sub="No partners with this status right now." icon={Store} /></div>}
          {list.map((p) => (
            <div key={p.id} className="rounded-3xl border border-slate-100 overflow-hidden bg-white hover:shadow-[0_16px_40px_rgba(37,99,235,0.10)] transition">
              <div className="relative h-24">
                <img src={p.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                  <p className="font-display font-black text-white text-sm leading-tight drop-shadow">{p.name}</p>
                  <StatusPill status={p.status} />
                </div>
              </div>
              <div className="p-3.5">
                <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 truncate"><MapPin className="w-3 h-3" /> {p.area}</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div><p className="text-[9px] font-black uppercase text-slate-400">Rating</p><p className="text-xs font-black text-slate-900">{p.rating || "—"}</p></div>
                  <div><p className="text-[9px] font-black uppercase text-slate-400">Orders</p><p className="text-xs font-black text-slate-900">{p.orders}</p></div>
                  <div><p className="text-[9px] font-black uppercase text-slate-400">GMV</p><p className="text-xs font-black text-slate-900">{inr(p.gmv, true)}</p></div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.status === "pending" && (
                    <>
                      <Btn size="sm" className="flex-1" onClick={() => { adminActions.approvePartner(p.id); notify(`${p.name} approved`); }}><Check className="w-3 h-3" /> Approve</Btn>
                      <Btn size="sm" variant="danger" onClick={() => { adminActions.rejectPartner(p.id); notify(`${p.name} rejected`); }}><X className="w-3 h-3" /></Btn>
                    </>
                  )}
                  {p.status === "active" && (
                    <>
                      <Btn size="sm" variant="ghost" className="flex-1" onClick={() => setActive(p)}><Eye className="w-3 h-3" /> Manage</Btn>
                      <Btn size="sm" variant="danger" onClick={() => { adminActions.suspendPartner(p.id); notify(`${p.name} suspended`); }}><Ban className="w-3 h-3" /></Btn>
                    </>
                  )}
                  {p.status === "suspended" && (
                    <Btn size="sm" variant="success" className="flex-1" onClick={() => { adminActions.suspendPartner(p.id); notify(`${p.name} reactivated`); }}><Play className="w-3 h-3" /> Reactivate</Btn>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Sheet open={!!active} onClose={() => setActive(null)} title={active?.name || "Partner"} sub={active?.area}>
        {active && (
          <div className="space-y-4">
            <img src={active.img} alt="" className="w-full h-32 object-cover rounded-2xl" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Owner", active.owner], ["Phone", active.phone], ["Email", active.email], ["Joined", active.joined], ["Commission", `${active.commission}%`], ["Payout", active.payout]].map(([k, v]) => (
                <div key={k} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{k}</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5 break-words">{v}</p>
                </div>
              ))}
            </div>
            <Field label="Platform commission (%)" hint="Applies to every completed order for this partner.">
              <div className="flex gap-2">
                <TextInput type="number" min="0" max="40" value={commission || active.commission} onChange={(e) => setCommission(e.target.value)} />
                <Btn onClick={() => { adminActions.updatePartner(active.id, { commission: Number(commission || active.commission) }); setActive(null); notify("Commission updated"); }}>Save</Btn>
              </div>
            </Field>
            <div className="flex gap-2">
              <Btn variant="danger" className="flex-1" onClick={() => { adminActions.suspendPartner(active.id); setActive(null); notify(`${active.name} suspended`); }}>
                <Ban className="w-4 h-4" /> Suspend partner
              </Btn>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

/* ============================================================== CUSTOMERS == */
export function CustomersPanel({ db, notify }) {
  const [q, setQ] = useState("");
  const [credit, setCredit] = useState(null);
  const [amount, setAmount] = useState("100");

  const rows = db.customers.filter((c) => `${c.name} ${c.email} ${c.id} ${c.area}`.toLowerCase().includes(q.toLowerCase()));
  const totalSpend = db.customers.reduce((a, c) => a + c.spend, 0);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: "Total customers", v: db.customers.length, tone: "blue", i: Users },
          { l: "Lifetime spend", v: inr(totalSpend, true), tone: "emerald", i: CircleDollarSign },
          { l: "Wallet balance held", v: inr(db.customers.reduce((a, c) => a + c.wallet, 0)), tone: "violet", i: Wallet },
        ].map(({ l, v, tone, i: Icon }) => (
          <Card key={l} pad="p-4">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${CHIP[tone] || CHIP.blue}`}><Icon className="w-5 h-5" /></span>
              <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{l}</p><p className="font-display font-black text-xl text-slate-900">{v}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHead title="Customers" sub="Block abusive accounts, credit wallets, review history" />
        <div className="flex items-center gap-2 mt-4 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or customer id…" className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-slate-400" />
        </div>

        <div className="mt-4 space-y-2">
          {rows.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-blue-200 transition">
              <img src={c.img} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black text-sm text-slate-900 truncate">{c.name}</p>
                  <StatusPill status={c.status} />
                </div>
                <p className="text-[11px] font-semibold text-slate-500 truncate">{c.email} · {c.area}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right"><p className="text-[9px] font-black uppercase text-slate-400">Orders</p><p className="text-xs font-black">{c.orders}</p></div>
                <div className="text-right"><p className="text-[9px] font-black uppercase text-slate-400">Spend</p><p className="text-xs font-black">{inr(c.spend)}</p></div>
                <div className="text-right hidden sm:block"><p className="text-[9px] font-black uppercase text-slate-400">Wallet</p><p className="text-xs font-black">{inr(c.wallet)}</p></div>
                <div className="flex gap-1.5">
                  <Btn size="sm" variant="ghost" onClick={() => { setCredit(c); setAmount("100"); }}><IndianRupee className="w-3 h-3" /></Btn>
                  <Btn size="sm" variant={c.status === "blocked" ? "success" : "danger"} onClick={() => { adminActions.toggleCustomerBlock(c.id); notify(`${c.name} ${c.status === "blocked" ? "unblocked" : "blocked"}`); }}>
                    {c.status === "blocked" ? <Play className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                  </Btn>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && <EmptyState title="No customers found" icon={Users} />}
        </div>
      </Card>

      <Sheet open={!!credit} onClose={() => setCredit(null)} title="Credit wallet" sub={credit ? `${credit.name} · current ₹${credit.wallet}` : ""}>
        <div className="space-y-4">
          <Field label="Amount to credit (₹)">
            <TextInput type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <div className="flex gap-1.5">
            {[50, 100, 250, 500].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))} className={`flex-1 py-2 rounded-full text-[11px] font-black border ${amount === String(v) ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600"}`}>₹{v}</button>
            ))}
          </div>
          <Btn className="w-full" onClick={() => { adminActions.creditWallet(credit.id, Number(amount)); notify(`${inr(amount)} credited to ${credit.name}`); setCredit(null); }}>
            <Wallet className="w-4 h-4" /> Confirm credit
          </Btn>
        </div>
      </Sheet>
    </div>
  );
}

/* =============================================================== SERVICES == */
export function ServicesPanel({ db, notify }) {
  const [editing, setEditing] = useState({});

  return (
    <div className="space-y-4">
      <Card>
        <SectionHead title="Services & pricing" sub="Control what customers can book and at what price" right={<Pill tone="blue">{db.services.filter((s) => s.active).length} live</Pill>} />
        <div className="mt-4 space-y-2">
          {db.services.map((s) => {
            const Icon = SERVICE_ICON[s.name] || Package;
            const value = editing[s.id] ?? s.price;
            return (
              <div key={s.id} className={`flex flex-wrap items-center gap-3 p-3.5 rounded-2xl border transition ${s.active ? "border-slate-100 bg-white" : "border-slate-200 bg-slate-50"}`}>
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${s.active ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-400"}`}><Icon className="w-5 h-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-sm text-slate-900">{s.name}</p>
                  <p className="text-[11px] font-semibold text-slate-500">Turnaround {s.turnaround} · {s.unit}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden">
                    <span className="pl-3 text-xs font-black text-slate-400">₹</span>
                    <input
                      type="number" min="0" value={value}
                      onChange={(e) => setEditing({ ...editing, [s.id]: e.target.value })}
                      className="w-16 bg-transparent px-1.5 py-2 text-sm font-black text-slate-800 outline-none"
                      aria-label={`${s.name} price`}
                    />
                  </div>
                  <Btn size="sm" variant={editing[s.id] !== undefined && Number(editing[s.id]) !== s.price ? "solid" : "ghost"} disabled={editing[s.id] === undefined || Number(editing[s.id]) === s.price}
                    aria-label={`Save ${s.name} price`}
                    onClick={() => { const next = { ...editing }; delete next[s.id]; adminActions.updatePrice(s.id, editing[s.id]); setEditing(next); notify(`${s.name} price updated to ₹${editing[s.id]}`); }}>
                    <Save className="w-3 h-3" />
                  </Btn>
                  <Toggle checked={s.active} label={`${s.name} availability`} onChange={() => { adminActions.toggleService(s.id); notify(`${s.name} ${s.active ? "paused" : "activated"}`); }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================= OFFERS == */
export function OffersPanel({ db, notify }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", title: "", type: "percent", value: 10, maxDiscount: 150, minOrder: 299, limit: 500, expires: "2027-03-31" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.code.trim()) return notify("Coupon code is required");
    adminActions.saveCoupon(form);
    setOpen(false);
    notify(`Coupon ${form.code.toUpperCase()} created`);
    setForm({ code: "", title: "", type: "percent", value: 10, maxDiscount: 150, minOrder: 299, limit: 500, expires: "2027-03-31" });
  };

  return (
    <div className="space-y-4">
      <Card>
        <SectionHead
          title="Offers & coupons"
          sub="Create discount codes, cap usage and switch campaigns on or off"
          right={<Btn size="sm" onClick={() => setOpen(true)}><Plus className="w-3.5 h-3.5" /> New coupon</Btn>}
        />
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {db.coupons.map((c) => (
            <div key={c.id} className={`rounded-3xl p-4 border relative overflow-hidden ${c.active ? "bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white border-transparent shadow-[0_16px_40px_rgba(37,99,235,0.30)]" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
              <BadgePercent className={`absolute -right-4 -bottom-4 w-24 h-24 ${c.active ? "text-white/10" : "text-slate-200"}`} />
              <div className="relative">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-black text-lg leading-tight">{c.title}</p>
                    <p className={`text-[11px] font-bold mt-0.5 ${c.active ? "text-sky-100" : "text-slate-500"}`}>
                      {c.type === "percent" ? `${c.value}% off` : c.type === "flat" ? `₹${c.value} off` : "Free delivery"} · min ₹{c.minOrder}
                    </p>
                  </div>
                  <StatusPill status={c.active ? "active" : "paused"} />
                </div>
                <button
                  onClick={() => notify(`Code ${c.code} copied`)}
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black border border-dashed ${c.active ? "border-white/60 bg-white/15" : "border-slate-300 bg-white"}`}
                >
                  {c.code} <Copy className="w-3 h-3" />
                </button>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-black mb-1">
                    <span className={c.active ? "text-white/80" : "text-slate-500"}>{c.uses} / {c.limit} used</span>
                    <span className={c.active ? "text-white/80" : "text-slate-500"}>Exp {c.expires}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${c.active ? "bg-white/25" : "bg-slate-200"}`}>
                    <div className={`h-full rounded-full ${c.active ? "bg-white" : "bg-slate-400"}`} style={{ width: `${Math.min(100, (c.uses / c.limit) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button
                    onClick={() => { adminActions.toggleCoupon(c.id); notify(`${c.code} ${c.active ? "paused" : "enabled"}`); }}
                    className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full text-[11px] font-black py-2 ${c.active ? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}
                  >
                    {c.active ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Enable</>}
                  </button>
                  <button
                    onClick={() => { adminActions.deleteCoupon(c.id); notify(`${c.code} deleted`); }}
                    className={`w-9 rounded-full flex items-center justify-center ${c.active ? "bg-white/20 text-white" : "bg-white border border-slate-200 text-red-500"}`}
                    aria-label={`Delete ${c.code}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Sheet open={open} onClose={() => setOpen(false)} title="New coupon" sub="Goes live immediately for all customers">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Coupon code"><TextInput required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="MONSOON15" /></Field>
            <Field label="Title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="15% off monsoon offer" /></Field>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="percent">Percentage off</option>
                <option value="flat">Flat amount off</option>
                <option value="shipping">Free pickup</option>
              </Select>
            </Field>
            <Field label="Value"><TextInput type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
            <Field label="Max discount (₹)"><TextInput type="number" min="0" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} /></Field>
            <Field label="Min order (₹)"><TextInput type="number" min="0" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} /></Field>
            <Field label="Usage limit"><TextInput type="number" min="1" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} /></Field>
            <Field label="Expires on"><TextInput type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} /></Field>
          </div>
          <Btn type="submit" className="w-full"><BadgePercent className="w-4 h-4" /> Create coupon</Btn>
        </form>
      </Sheet>
    </div>
  );
}

/* =============================================================== PAYMENTS == */
export function PaymentsPanel({ db, notify }) {
  const totals = db.settlements.reduce((acc, s) => ({
    gross: acc.gross + s.gross, commission: acc.commission + s.commission,
    payout: acc.payout + s.payout, pending: acc.pending + (s.status === "pending" ? s.payout : 0),
  }), { gross: 0, commission: 0, payout: 0, pending: 0 });

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { l: "Gross collected", v: inr(totals.gross, true), tone: "blue" },
          { l: "Platform commission", v: inr(totals.commission, true), tone: "emerald" },
          { l: "Partner payouts", v: inr(totals.payout, true), tone: "violet" },
          { l: "Awaiting release", v: inr(totals.pending, true), tone: "orange" },
        ].map(({ l, v, tone }) => (
          <Card key={l} pad="p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{l}</p>
            <p className="font-display font-black text-2xl text-slate-900 mt-1">{v}</p>
            <div className="mt-2"><Pill tone={tone}><TrendingUp className="w-3 h-3" /> this cycle</Pill></div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHead title="Partner settlements" sub="Release or hold weekly payouts" right={<Pill tone="amber">{db.settlements.filter((s) => s.status !== "paid").length} open</Pill>} />
        <div className="mt-4 space-y-2">
          {db.settlements.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 transition">
              <span className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><Receipt className="w-5 h-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-sm text-slate-900">{s.partner}</p>
                  <StatusPill status={s.status} />
                </div>
                <p className="text-[11px] font-semibold text-slate-500">{s.id} · {s.period} · {s.orders} orders · {s.method}</p>
                <p className="text-[10px] font-bold text-slate-400">{s.date}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="font-display font-black text-base text-slate-900 leading-none">{inr(s.payout)}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">of {inr(s.gross)} · {inr(s.commission)} fee</p>
                </div>
                <div className="flex gap-1.5">
                  {s.status !== "paid" && (
                    <Btn size="sm" variant="success" onClick={() => { adminActions.paySettlement(s.id); notify(`${inr(s.payout)} released to ${s.partner}`); }}>
                      <Check className="w-3 h-3" /> Pay
                    </Btn>
                  )}
                  <Btn size="sm" variant={s.status === "on-hold" ? "ghost" : "danger"} onClick={() => { adminActions.holdSettlement(s.id); notify(`Payout ${s.id} ${s.status === "on-hold" ? "released" : "held"}`); }}>
                    {s.status === "on-hold" ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================ REVIEWS == */
export function ReviewsPanel({ db, notify }) {
  const avg = db.reviews.reduce((a, r) => a + r.rating, 0) / (db.reviews.length || 1);
  const flagged = db.reviews.filter((r) => r.status === "flagged").length;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: "Average rating", v: avg.toFixed(1), icon: Star, tone: "amber" },
          { l: "Total reviews", v: db.reviews.length, icon: StarIcon, tone: "blue" },
          { l: "Flagged / hidden", v: db.reviews.filter((r) => ["flagged", "hidden"].includes(r.status)).length, icon: AlertCircle, tone: "red" },
        ].map(({ l, v, icon: Icon, tone }) => (
          <Card key={l} pad="p-4">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${CHIP[tone] || CHIP.blue}`}><Icon className="w-5 h-5" /></span>
              <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{l}</p><p className="font-display font-black text-xl text-slate-900">{v}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHead title="Moderation queue" sub="Publish, hide or flag reviews before they affect reputation" right={flagged ? <Pill tone="red">{flagged} flagged</Pill> : <Pill tone="emerald">clean</Pill>} />
        <div className="mt-4 space-y-2">
          {db.reviews.map((r) => (
            <div key={r.id} className="p-3.5 rounded-2xl border border-slate-100 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="font-black text-xs text-slate-900">{r.customer}</p>
                <span className="text-[11px] font-semibold text-slate-400">on {r.partner}</span>
                <StatusPill status={r.status} />
                <span className="text-[10px] font-bold text-slate-400 ml-auto">{r.date}</span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1.5">{r.text}</p>
              <div className="flex gap-1.5 mt-2.5">
                <Btn size="sm" variant="soft" onClick={() => { adminActions.setReviewStatus(r.id, "published"); notify("Review published"); }}><Check className="w-3 h-3" /> Publish</Btn>
                <Btn size="sm" variant="ghost" onClick={() => { adminActions.setReviewStatus(r.id, "hidden"); notify("Review hidden from customers"); }}><Eye className="w-3 h-3" /> Hide</Btn>
                <Btn size="sm" variant="danger" onClick={() => { adminActions.setReviewStatus(r.id, "flagged"); notify("Review flagged for follow-up"); }}><AlertCircle className="w-3 h-3" /> Flag</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =============================================================== SETTINGS == */
export function SettingsPanel({ db, notify }) {
  const [form, setForm] = useState(db.settings);
  const dirty = JSON.stringify(form) !== JSON.stringify(db.settings);

  const save = () => { adminActions.saveSettings(form); notify("Platform settings saved"); };

  return (
    <div className="space-y-4">
      <Card>
        <SectionHead title="Platform settings" sub="City, commission, fees and notification rules" right={dirty ? <Pill tone="orange">unsaved</Pill> : <Pill tone="emerald">saved</Pill>} />
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <Field label="Platform name"><TextInput value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} /></Field>
          <Field label="Service city"><TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="Default commission (%)"><TextInput type="number" min="0" max="40" value={form.commission} onChange={(e) => setForm({ ...form, commission: Number(e.target.value) })} /></Field>
          <Field label="Pickup fee (₹)"><TextInput type="number" min="0" value={form.pickupFee} onChange={(e) => setForm({ ...form, pickupFee: Number(e.target.value) })} /></Field>
          <Field label="Free pickup above (₹)"><TextInput type="number" min="0" value={form.freePickupAbove} onChange={(e) => setForm({ ...form, freePickupAbove: Number(e.target.value) })} /></Field>
          <Field label="Cancellation window (mins)"><TextInput type="number" min="0" value={form.cancelWindow} onChange={(e) => setForm({ ...form, cancelWindow: Number(e.target.value) })} /></Field>
          <Field label="Support phone"><TextInput value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} /></Field>
          <Field label="Support email"><TextInput value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} /></Field>
        </div>

        <div className="mt-6 space-y-2">
          {[
            { key: "autoApprovePartners", t: "Auto-approve new partners", d: "Skip manual review — not recommended" },
            { key: "sendOrderSms", t: "Order status SMS", d: "Send an SMS at every pipeline change" },
            { key: "sendOfferPush", t: "Offer push notifications", d: "Notify customers when a coupon goes live" },
          ].map(({ key, t, d }) => (
            <div key={key} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="min-w-0 flex-1">
                <p className="font-black text-xs text-slate-900">{t}</p>
                <p className="text-[11px] font-semibold text-slate-500">{d}</p>
              </div>
              <Toggle checked={!!form[key]} label={t} onChange={(v) => setForm({ ...form, [key]: v })} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <Btn onClick={save} disabled={!dirty}><Save className="w-4 h-4" /> Save settings</Btn>
          <Btn variant="ghost" onClick={() => setForm(db.settings)} disabled={!dirty}><RefreshCw className="w-4 h-4" /> Discard</Btn>
        </div>
      </Card>

      <Card className="border-red-100">
        <SectionHead title="Demo data" sub="This console runs on local sample data. Reset restores the original seed." />
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn variant="danger" onClick={() => { adminActions.resetDemoData(); notify("Demo data reset to original seed"); }}>
            <RefreshCw className="w-4 h-4" /> Reset demo data
          </Btn>
          <Btn variant="ghost" onClick={() => {
            const csv = toCsv(db.orders.map(({ id, customer, partner, service, amount, status }) => ({ id, customer, partner, service, amount, status })));
            const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
            const a = document.createElement("a"); a.href = url; a.download = "bbll-orders.csv"; a.click();
            URL.revokeObjectURL(url); notify("Orders exported");
          }}>
            <Download className="w-4 h-4" /> Export all data
          </Btn>
        </div>
      </Card>
    </div>
  );
}
