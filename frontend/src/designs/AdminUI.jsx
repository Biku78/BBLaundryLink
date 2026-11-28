import { motion, AnimatePresence } from "framer-motion";
import { X, CircleCheck, AlertCircle } from "lucide-react";
import { STATUS_TONE, STATUS_LABEL } from "../data/adminData";
import { TONE, DOT, BAR } from "./adminTones";
import "./admin.css";

/* ============================================================ primitives === */

export function Card({ children, className = "", pad = "p-5 sm:p-6", ...rest }) {
  return (
    <div
      className={`bg-white rounded-[28px] border border-white shadow-[0_16px_50px_rgba(37,99,235,0.10)] ${pad} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Pill({ children, tone = "slate", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 border ${TONE[tone] || TONE.slate} text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${className}`}>
      {children}
    </span>
  );
}

export function StatusPill({ status }) {
  const key = String(status || "").toLowerCase();
  const tone = STATUS_TONE[key] || "slate";
  return (
    <span className={`inline-flex items-center gap-1.5 border ${TONE[tone]} text-[11px] font-black px-2.5 py-1 rounded-full whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[tone]}`} />
      {STATUS_LABEL[key] || status}
    </span>
  );
}

export function Btn({ children, variant = "solid", size = "md", className = "", ...rest }) {
  const base = "inline-flex items-center justify-center gap-1.5 font-black rounded-full transition active:scale-[.98] disabled:opacity-40 disabled:pointer-events-none";
  const sizes = { sm: "text-[11px] px-3 py-1.5", md: "text-xs px-4 py-2.5", lg: "text-sm px-5 py-3" };
  const variants = {
    solid: "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/25 hover:brightness-105",
    dark: "bg-slate-900 text-white hover:bg-slate-800",
    soft: "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100",
    ghost: "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    success: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:brightness-105",
    orange: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function SectionHead({ title, sub, right, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div>
        <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight">{title}</h2>
        {sub && <p className="text-xs font-semibold text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Sparkline({ data, tone = "blue", height = 34 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${height - ((v - min) / span) * (height - 6) - 3}`);
  const stroke = { blue: "#2563EB", orange: "#F97316", emerald: "#10B981", violet: "#7C3AED", white: "#ffffff" }[tone] || "#2563EB";
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity={tone === "white" ? 0.85 : 1} />
    </svg>
  );
}

export function AreaChart({ series, tone = "blue" }) {
  const { labels, data, compare } = series;
  const all = [...data, ...compare];
  const max = Math.max(...all) * 1.08;
  const min = Math.min(...all) * 0.88;
  const span = max - min || 1;
  const w = 100;
  const h = 46;
  const x = (i) => (i / (data.length - 1)) * w;
  const y = (v) => h - ((v - min) / span) * h;
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const cmp = compare.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const id = `grad-${tone}`;
  const colors = { blue: ["#2563EB", "#38BDF8"], violet: ["#7C3AED", "#38BDF8"] }[tone] || ["#2563EB", "#38BDF8"];
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-40 sm:h-48" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.34" />
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="#E2E8F0" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={cmp} fill="none" stroke="#94A3B8" strokeWidth="1.1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <path d={line} fill="none" stroke={colors[0]} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="flex justify-between mt-2 px-0.5">
        {labels.map((l) => (
          <span key={l} className="text-[10px] font-bold text-slate-400">{l}</span>
        ))}
      </div>
    </div>
  );
}

export function Progress({ pct, tone = "blue" }) {
  return (
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${BAR[tone]}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block text-[11px] font-semibold text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({ className = "", ...rest }) {
  return (
    <input
      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition ${className}`}
      {...rest}
    />
  );
}

export function Select({ className = "", children, ...rest }) {
  return (
    <select
      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={label}
      className={`relative w-11 h-6 rounded-full transition shrink-0 ${checked ? "bg-gradient-to-r from-blue-600 to-sky-500" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export function EmptyState({ title, sub, icon: Icon = AlertCircle }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <p className="font-display font-black text-slate-800 mt-3">{title}</p>
      {sub && <p className="text-xs font-semibold text-slate-500 mt-1 max-w-xs mx-auto">{sub}</p>}
    </div>
  );
}

export function Sheet({ open, onClose, title, sub, children, width = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={title}
        >
          <motion.div
            className={`w-full ${width} bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl max-h-[88vh] overflow-y-auto`}
            initial={{ y: 40, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur px-5 sm:px-6 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3 rounded-t-[32px]">
              <div>
                <h3 className="font-display font-black text-lg text-slate-900">{title}</h3>
                {sub && <p className="text-xs font-semibold text-slate-500 mt-0.5">{sub}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 sm:px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 max-w-[92vw]"
          role="status"
        >
          <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
