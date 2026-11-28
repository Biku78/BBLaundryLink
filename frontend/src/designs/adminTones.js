// Colour tokens for the admin console. Kept in a static map so Tailwind can
// see every class name at build time (dynamic `bg-${tone}-100` never compiles).

export const TONE = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  red: "bg-red-50 text-red-600 border-red-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};
export const DOT = {
  blue: "bg-blue-500", sky: "bg-sky-500", orange: "bg-orange-500",
  emerald: "bg-emerald-500", amber: "bg-amber-500", violet: "bg-violet-500",
  red: "bg-red-500", slate: "bg-slate-400",
};
export const CHIP = {
  blue: "bg-blue-100 text-blue-600", sky: "bg-sky-100 text-sky-600",
  orange: "bg-orange-100 text-orange-600", emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-700", violet: "bg-violet-100 text-violet-600",
  red: "bg-red-100 text-red-600", slate: "bg-slate-100 text-slate-500",
};
export const BAR = {
  blue: "from-blue-600 to-sky-500", sky: "from-sky-500 to-cyan-400",
  orange: "from-orange-500 to-amber-500", emerald: "from-emerald-500 to-teal-500",
  violet: "from-violet-600 to-indigo-500", amber: "from-amber-500 to-orange-500",
  red: "from-red-500 to-rose-500", slate: "from-slate-400 to-slate-500",
};

