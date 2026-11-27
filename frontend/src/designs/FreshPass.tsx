import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../services/api";
import { setCredentials } from "../features/auth/authSlice";
import { validateRegistration } from "../features/registration/validation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WashingMachine,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ChevronDown,
  Check,
  Gift,
  ShieldCheck,
  Star,
  KeyRound,
  BadgeCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
  X,
  Headphones,
  Droplets,
  Wind,
  Shirt,
  RefreshCcw,
} from "lucide-react";

type Props = {
  onBack: () => void;
  onSuccess: () => void;
  initial: "login" | "register";
  onModeChange: (register: boolean) => void;
};

/* ============================================================
   "THE FRESH PASS" — an original BB LaundryLink idea.
   Login & Register live on ONE clothing care-label card.
   Flip the card (3D) -> front = Login, back = Register.
   Care symbols, stitched border & barcode = the label details.
   ============================================================ */

const inp =
  "w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]";
const lbl = "text-[10px] font-black tracking-[0.14em] text-slate-400 uppercase";

export default function Auth({
  onBack,
  onSuccess,
  initial,
  onModeChange,
}: Props) {
  const flipped = initial === "register";
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const dispatch = useDispatch();
  const busy = loginState.isLoading || registerState.isLoading;
  const setFlipped = (value: boolean) => {
    if (!busy) {
      setMsg("");
      setLoginPass("");
      setRegPass("");
      setConfirmPass("");
      onModeChange(value);
    }
  };
  const [confirmPass, setConfirmPass] = useState("");
  const messageRef = useRef<HTMLDivElement>(null);

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [loginId, setLoginId] = useState(() => {
    try {
      return localStorage.getItem("rememberedEmail") || "";
    } catch {
      return "";
    }
  });
  const [loginPass, setLoginPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [city, setCity] = useState("Bhubaneswar");
  const [agree, setAgree] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (msg) messageRef.current?.focus();
  }, [msg]);
  const flash = (message: string) => setMsg(message);
  function apiError(error: any, fallback: string) {
    flash(
      ["FETCH_ERROR", "PARSING_ERROR", "TIMEOUT_ERROR"].includes(
        error.status,
      ) || Number(error.status) >= 500
        ? fallback
        : error.data?.message || "Please check your details and try again.",
    );
  }
  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setMsg("");
    try {
      const result = await login({
        email: loginId.trim(),
        password: loginPass,
      }).unwrap();
      if (!result.data?.token || !result.data?.user) {
        flash("Unexpected server response. Please try again.");
        return;
      }
      try {
        if (remember) localStorage.setItem("rememberedEmail", loginId.trim());
        else localStorage.removeItem("rememberedEmail");
      } catch {
        /* Storage may be disabled. */
      }
      dispatch(setCredentials(result.data));
      setLoginPass("");
      onSuccess();
    } catch (error) {
      apiError(
        error,
        "Unable to reach the login service. Please try again later.",
      );
    }
  }
  async function submitRegister(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const details = {
      name: name.trim(),
      mobile: phone,
      email: regEmail.trim().toLowerCase(),
      password: regPass,
      confirm_password: confirmPass,
      accept_terms: agree,
    };
    const error = validateRegistration(details);
    if (error) {
      flash(error);
      return;
    }
    setMsg("");
    try {
      await register(details).unwrap();
      setLoginId(details.email);
      setName("");
      setPhone("");
      setRegEmail("");
      setRegPass("");
      setConfirmPass("");
      setAgree(false);
      onModeChange(false);
      flash("Your Fresh Pass is ready! Sign in with your email and password.");
    } catch (error) {
      apiError(
        error,
        "Unable to create your account right now. Please try again later.",
      );
    }
  }
  const strength = (() => {
    let s = 0;
    if (regPass.length >= 6) s++;
    if (regPass.length >= 10) s++;
    if (/[A-Z]/.test(regPass) && /[0-9]/.test(regPass)) s++;
    if (/[^A-Za-z0-9]/.test(regPass)) s++;
    return s;
  })();

  const careSymbols = [
    { Icon: WashingMachine, t: "Wash Fresh" },
    { Icon: Droplets, t: "Gentle Care" },
    { Icon: Wind, t: "Quick Dry" },
    { Icon: Shirt, t: "Wear Happy" },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`fresh-pass min-h-screen hero-mesh relative overflow-hidden ${flipped ? "is-register" : ""}`}
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-orange-200/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
      <div className="absolute top-32 left-[5%] w-12 h-12 rounded-full border-2 border-sky-300/80 animate-bubble hidden md:block" />
      <div
        className="absolute bottom-40 right-[6%] w-8 h-8 rounded-full bg-orange-300/80 animate-bubble hidden md:block"
        style={{ animationDelay: ".8s" }}
      />
      <div
        className="absolute top-[55%] left-[3%] w-6 h-6 rounded-full border-2 border-blue-200 animate-bubble hidden lg:block"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="fresh-pass-container relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-16">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-full shadow-sm hover:border-blue-300 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <img
            src="/images/logo.webp"
            alt="BB LaundryLink"
            className="fresh-pass-logo"
          />
          <a
            href="mailto:support@bblaundrylink.com"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 bg-white/80 border border-slate-200 px-4 py-2.5 rounded-full shadow-sm"
          >
            <Headphones className="w-4 h-4 text-blue-600" /> Contact Support
          </a>
        </div>

        {/* heading — the idea */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fresh-pass-heading text-center mt-7"
        >
          <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-black tracking-[0.18em] px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AN ORIGINAL BB
            LAUNDRYLINK IDEA
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mt-4 text-slate-900">
            The <span className="shimmer-text">Fresh Pass</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2.5 max-w-lg mx-auto text-sm sm:text-base">
            One care-label card holds both doors —{" "}
            <b className="text-slate-800">front is Login</b>, flip it over for{" "}
            <b className="text-slate-800">Register</b>. Just like the tag inside
            your favourite shirt.
          </p>

          {/* mode switch */}
          <div className="inline-flex bg-white border border-slate-200 rounded-full p-1.5 shadow-sm mt-6">
            {(
              [
                { key: false, label: "Login — Front", Icon: KeyRound },
                { key: true, label: "Register — Back", Icon: Sparkles },
              ] as const
            ).map((o) => (
              <button
                key={o.label}
                aria-pressed={flipped === o.key}
                disabled={busy}
                onClick={() => setFlipped(o.key)}
                className="relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-2"
              >
                {flipped === o.key && (
                  <motion.span
                    layoutId="pass-mode"
                    className="absolute inset-0 bg-slate-900 rounded-full shadow"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <o.Icon
                  className={`relative z-10 w-4 h-4 ${flipped === o.key ? "text-amber-400" : "text-slate-400"}`}
                />
                <span
                  className={`relative z-10 ${flipped === o.key ? "text-white" : "text-slate-500"}`}
                >
                  {o.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {msg && (
            <motion.div
              ref={messageRef}
              role="alert"
              tabIndex={-1}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto mt-5 bg-slate-900 text-white text-sm font-bold rounded-2xl px-5 py-3.5 flex items-center gap-2.5 shadow-xl relative z-20"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" /> {msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= THE FLIP CARD ================= */}
        <div className="fresh-pass-stage relative mt-8 perspective-1200 max-w-4xl mx-auto">
          {/* flip button */}
          <button
            onClick={() => setFlipped(!flipped)}
            className="absolute -top-5 right-5 sm:right-8 z-30 bg-slate-900 text-white text-xs font-black pl-3 pr-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition"
          >
            <RefreshCcw
              className={`w-4 h-4 text-amber-400 transition-transform duration-500 ${flipped ? "rotate-180" : ""}`}
            />
            Flip the Pass
          </button>
          {/* hanging tag hole */}
          <div className="absolute -top-3 left-8 sm:left-12 z-30 flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-[#EFF6FF] border-[5px] border-slate-900 shadow" />
          </div>

          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0.1, 0.2, 1] }}
            className="fresh-pass-rotator relative preserve-3d w-full h-[800px] sm:h-[660px] lg:h-[600px]"
          >
            {/* ============ FRONT — LOGIN ============ */}
            <div
              aria-hidden={flipped}
              inert={flipped}
              className="fresh-pass-front absolute inset-0 backface-hidden bg-white rounded-[36px] shadow-[0_35px_90px_-20px_rgba(15,23,42,0.3)] border border-white overflow-hidden"
            >
              <div className="absolute inset-3 border-2 border-dashed border-slate-200 rounded-[28px] pointer-events-none z-20" />
              <div className="grid lg:grid-cols-[0.92fr_1fr] h-full">
                {/* visual */}
                <div className="relative hidden lg:block">
                  <img
                    src="/images/landing-fresh.webp"
                    alt="Fresh laundry"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-900/10 to-transparent" />
                  <span className="absolute top-6 left-6 bg-white/95 rounded-full pl-1.5 pr-3.5 py-1.5 flex items-center gap-2 shadow-lg">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center">
                      <WashingMachine className="w-4 h-4" />
                    </span>
                    <img
                      src="/images/logo.webp"
                      className="fresh-pass-logo"
                      alt="BB LaundryLink"
                    />
                  </span>
                  <span className="absolute top-6 right-6 bg-white rounded-full px-3 py-1.5 text-[11px] font-black flex items-center gap-1 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{" "}
                    Fresh care
                  </span>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-[10px] font-black tracking-[0.22em] text-sky-300">
                      SIDE A — MEMBERS
                    </p>
                    <p className="font-display font-black text-3xl leading-tight mt-1.5">
                      Your Laundry,
                      <br />
                      Our Priority!
                    </p>
                    <div className="flex gap-2 mt-4">
                      {["Find", "Compare", "Fresh care"].map((c) => (
                        <span
                          key={c}
                          className="bg-white/15 backdrop-blur border border-white/25 text-[10px] font-black px-2.5 py-1.5 rounded-full flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-300" /> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* form */}
                <div className="fresh-pass-form-panel relative p-6 sm:p-9 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display font-black text-[26px] leading-tight">
                        Welcome back
                      </h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        Login with your Fresh Pass to book, track & wash happy.
                      </p>
                    </div>
                    <span className="hidden sm:flex shrink-0 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1.5 rounded-full items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> SECURE
                    </span>
                  </div>

                  <form
                    onSubmit={submitLogin}
                    aria-busy={busy}
                    className="space-y-4 mt-6"
                  >
                    <div>
                      <label className={lbl}>Email address</label>
                      <div className="relative mt-1.5">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          disabled={busy}
                          aria-label="Email address"
                          type="email"
                          autoComplete="username"
                          required
                          maxLength={150}
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          placeholder="ritika@gmail.com"
                          className={inp}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Password</label>
                      <div className="relative mt-1.5">
                        <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          disabled={busy}
                          aria-label="Password"
                          autoComplete="current-password"
                          required
                          type={showLoginPass ? "text" : "password"}
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="Enter your password"
                          className={`${inp} pr-12`}
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowLoginPass(!showLoginPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                        >
                          {showLoginPass ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="w-4 h-4 accent-blue-600"
                        />{" "}
                        Remember email
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          flash(
                            "Password reset is not connected yet. Contact support@bblaundrylink.com.",
                          )
                        }
                        className="text-xs font-black text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-shine w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition"
                    >
                      {busy ? "Signing in…" : "Login to Dashboard"}{" "}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          flash(
                            "OTP login is not connected yet. Please use email and password.",
                          )
                        }
                        className="bg-slate-900 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition text-sm"
                      >
                        <KeyRound className="w-4 h-4 text-amber-400" /> OTP
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          flash(
                            "Google sign-in is not connected yet. Please use email and password.",
                          )
                        }
                        className="border-2 border-slate-200 rounded-2xl py-3.5 font-black text-sm flex items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition bg-white"
                      >
                        <span className="font-display text-base leading-none">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                        </span>{" "}
                        Google
                      </button>
                    </div>
                  </form>

                  <button
                    onClick={() => setFlipped(true)}
                    className="mt-6 w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition text-sm"
                  >
                    New here? Flip the Pass to create account{" "}
                    <RefreshCcw className="w-4 h-4" />
                  </button>

                  {/* care label footer */}
                  <div className="mt-auto pt-6">
                    <div className="flex items-end justify-between gap-4 border-t border-dashed border-slate-200 pt-4">
                      <div className="flex gap-2">
                        {careSymbols.map(({ Icon, t }) => (
                          <div
                            key={t}
                            className="flex flex-col items-center gap-1"
                          >
                            <span className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-500">
                              <Icon className="w-4.5 h-4.5" />
                            </span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide">
                              {t}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="barcode h-8 w-32 ml-auto" />
                        <p className="text-[9px] font-black tracking-[0.3em] text-slate-400 mt-1">
                          BB • 2026 • FRESH
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-[10px] font-bold text-slate-400 mt-3">
                      100% Fresh • Made with ❤️ in Bhubaneswar • Do not iron
                      your worries
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ BACK — REGISTER ============ */}
            <div
              aria-hidden={!flipped}
              inert={!flipped}
              className="fresh-pass-back absolute inset-0 backface-hidden bg-white rounded-[36px] shadow-[0_35px_90px_-20px_rgba(15,23,42,0.3)] border border-white overflow-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="absolute inset-3 border-2 border-dashed border-slate-200 rounded-[28px] pointer-events-none z-20" />
              <div className="grid lg:grid-cols-[1fr_0.92fr] h-full">
                {/* form */}
                <div className="fresh-pass-form-panel relative p-6 sm:p-9 flex flex-col order-2 lg:order-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display font-black text-[26px] leading-tight">
                        Get your Fresh Pass
                      </h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        One account for your next fresh chapter.
                      </p>
                    </div>
                    <span className="hidden sm:flex shrink-0 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-full items-center gap-1 shadow-lg shadow-orange-500/30 rotate-2">
                      <Gift className="w-3.5 h-3.5" /> 10% OFF
                    </span>
                  </div>

                  <form
                    onSubmit={submitRegister}
                    aria-busy={busy}
                    className="space-y-3 mt-5"
                  >
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        disabled={busy}
                        aria-label="Full name"
                        autoComplete="name"
                        maxLength={100}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name — e.g. Ritika Swain"
                        className={inp}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          disabled={busy}
                          aria-label="Mobile number"
                          type="tel"
                          autoComplete="tel-national"
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          className={`${inp} pr-3`}
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <select
                          disabled={busy}
                          aria-label="City (display preference only)"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`${inp} pr-8 appearance-none cursor-pointer`}
                        >
                          <option>Bhubaneswar</option>
                          <option>Cuttack</option>
                          <option>Puri</option>
                          <option>Rourkela</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        disabled={busy}
                        aria-label="Email address"
                        type="email"
                        autoComplete="email"
                        maxLength={150}
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Email address"
                        className={inp}
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          disabled={busy}
                          aria-label="Create password"
                          autoComplete="new-password"
                          required
                          type={showRegPass ? "text" : "password"}
                          value={regPass}
                          onChange={(e) => setRegPass(e.target.value)}
                          placeholder="Create password"
                          className={`${inp} pr-12`}
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowRegPass(!showRegPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                        >
                          {showRegPass ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {regPass && (
                        <div className="flex items-center gap-2 mt-2 px-1">
                          <div className="flex gap-1 flex-1">
                            {[1, 2, 3, 4].map((n) => (
                              <span
                                key={n}
                                className={`h-1.5 flex-1 rounded-full transition-all ${strength >= n ? (strength <= 1 ? "bg-red-400" : strength === 2 ? "bg-amber-400" : "bg-emerald-500") : "bg-slate-100"}`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-black text-slate-500">
                            {
                              ["Weak", "Weak", "Good", "Strong", "Excellent"][
                                strength
                              ]
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Gift className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        disabled={busy}
                        aria-label="Confirm password"
                        type={showRegPass ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Confirm password"
                        className={inp}
                      />
                    </div>
                    <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer bg-slate-50 border border-slate-100 rounded-2xl p-3 leading-relaxed">
                      <input
                        disabled={busy}
                        aria-label="Accept Terms and Privacy Policy"
                        required
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0"
                      />
                      <span>
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-blue-600"
                          onClick={() =>
                            flash(
                              "Use accurate account details and keep your password private. Booking is a design preview; contact support@bblaundrylink.com for help.",
                            )
                          }
                        >
                          Terms
                        </button>{" "}
                        &{" "}
                        <button
                          type="button"
                          className="text-blue-600"
                          onClick={() =>
                            flash(
                              "We store your name, email, mobile number and hashed password for your account. Contact support@bblaundrylink.com for data requests. Final policies require operator review.",
                            )
                          }
                        >
                          Privacy Policy
                        </button>{" "}
                        of BB LaundryLink.
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-shine w-full bg-gradient-to-r from-orange-500 to-amber-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/35 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition"
                    >
                      {busy ? "Creating account…" : "Create Free Account"}{" "}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>

                  <button
                    onClick={() => setFlipped(false)}
                    className="mt-4 w-full bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition text-sm"
                  >
                    Already a member? Flip back to Login{" "}
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] font-bold text-slate-400 mt-4">
                    Customer accounts are live. Booking and offers are design
                    previews.
                  </p>
                </div>

                {/* visual */}
                <div className="relative hidden lg:block order-1 lg:order-2">
                  <img
                    src="/images/service-pickup.webp"
                    alt="BB LaundryLink partner shop"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-900/10 to-transparent" />
                  <span className="absolute top-6 right-6 bg-white/95 rounded-full px-3 py-1.5 text-[11px] font-black shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />{" "}
                    Explore local partners
                  </span>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-[10px] font-black tracking-[0.22em] text-sky-300">
                      SIDE B — NEW MEMBERS
                    </p>
                    <p className="font-display font-black text-3xl leading-tight mt-1.5">
                      A fresh start
                      <br />
                      for your everyday
                    </p>
                    <div className="mt-4 bg-white/12 backdrop-blur border-2 border-dashed border-white/40 rounded-2xl p-3.5 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                        <Gift className="w-5 h-5" />
                      </span>
                      <div className="leading-tight">
                        <p className="font-display font-black">WELCOME10</p>
                        <p className="text-[11px] font-bold text-sky-200">
                          Sample offer • not redeemable yet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* under-card caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center mt-7 text-sm font-semibold text-slate-500 flex items-center justify-center gap-2 flex-wrap"
        >
          <RefreshCcw className="w-4 h-4 text-blue-500" />
          Tip: press{" "}
          <button
            onClick={() => setFlipped(!flipped)}
            className="font-black text-slate-800 underline underline-offset-4 decoration-orange-400 decoration-2 hover:text-blue-600 transition"
          >
            "Flip the Pass"
          </button>{" "}
          — one card, both doors. No page changes, ever.
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 mt-5 text-slate-500">
          <span className="flex items-center gap-1.5 text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Customer Access
          </span>
          <span className="flex items-center gap-1.5 text-xs font-black">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> Fresh by
            Design
          </span>
          <span className="flex items-center gap-1.5 text-xs font-black">
            <Headphones className="w-4 h-4 text-blue-600" /> Contact Support
          </span>
        </div>
      </div>
    </main>
  );
}
