import { samplePartners } from "../data/samplePartners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { api } from "../services/api";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, CalendarDays, Truck, Wallet, User, Bell, MapPin, Search, Star, Heart,
  Clock, Navigation, ChevronDown, ArrowRight, Sparkles, Shirt, WashingMachine,
  Zap, Gem, Footprints, Bike, Check, X, Plus, Minus, Copy, Gift, ShieldCheck,
  Headphones, BadgeCheck, Timer, Phone, Settings, LogOut, ChevronRight,
  Package, Sparkle, SlidersHorizontal, LayoutGrid, List, Trash2, CreditCard,
  CircleCheck, Store, Route, CalendarClock, BadgePercent
} from "lucide-react";

/* ============================================================
   BB LAUNDRYLINK — NEW DESIGN (Not Old Sidebar + Topbar)
   OLD: Left Sidebar + Top Topbar (every MERN dashboard same)
   NEW: 1) Floating Glass Pill Navbar (top, centered)
        2) Bottom Floating Dock Navigation (like iPhone / Blinkit)
        3) Bento Grid Dashboard (like Apple / Linear / Notion)
        4) App-style Cards (like Zomato / Swiggy / Airbnb)
   ============================================================ */

function priceFor(partner: { name: string; price: number }, service: string) {
  const shop = samplePartners.find(item => item.name === partner.name);
  return shop?.rates?.[service] ?? partner.price;
}

type Partner = {
  id: number; name: string; area: string; rating: number; reviews: number;
  price: number; mrp: number; distance: string; time: string; img: string;
  tag: string; services: string[]; offer: string; color: string;
};
type Booking = {
  id: string; partner: string; service: string; qty: number; price: number;
  status: string; date: string; slot: string; img: string;
};

const PARTNERS: Partner[] = [
  { id:1, name:"FreshWash Laundry", area:"Patia, Bhubaneswar", rating:4.7, reviews:1240, price:50, mrp:70, distance:"1.2 km", time:"30 mins", img:"/images/bento-freshwash.webp", tag:"Most Loved", services:["Wash & Fold","Ironing"], offer:"10% OFF", color:"from-blue-600 to-sky-500" },
  { id:2, name:"CleanCare Laundry", area:"Kharavela Nagar, BBSR", rating:4.6, reviews:980, price:60, mrp:80, distance:"2.1 km", time:"40 mins", img:"/images/bento-cleancare.webp", tag:"Premium Care", services:["Dry Cleaning","Wash & Fold"], offer:"Free Pickup", color:"from-cyan-600 to-blue-600" },
  { id:3, name:"SmartWash Laundry", area:"IRC Village, BBSR", rating:4.8, reviews:2100, price:45, mrp:65, distance:"3.0 km", time:"50 mins", img:"/images/bento-smartwash.webp", tag:"Best Price", services:["Wash & Fold","Ironing","Dry Cleaning"], offer:"₹45/kg only", color:"from-indigo-600 to-blue-500" },
  { id:4, name:"Suds & Shine Hub", area:"Saheed Nagar, BBSR", rating:4.5, reviews:760, price:55, mrp:75, distance:"1.8 km", time:"35 mins", img:"/images/bento-suds.webp", tag:"Express", services:["Wash & Fold"], offer:"30 Min Express", color:"from-sky-500 to-cyan-400" },
  { id:5, name:"UrbanPress Studio", area:"Khandagiri, BBSR", rating:4.9, reviews:1890, price:70, mrp:99, distance:"4.2 km", time:"60 mins", img:"/images/bento-urbanpress.webp", tag:"Top Rated", services:["Dry Cleaning","Ironing"], offer:"Premium Finish", color:"from-blue-700 to-indigo-600" },
  { id:6, name:"EcoWash Hub", area:"Patia, Bhubaneswar", rating:4.6, reviews:640, price:48, mrp:68, distance:"2.5 km", time:"45 mins", img:"/images/landing-fresh.webp", tag:"Eco Friendly", services:["Wash & Fold","Shoe Care"], offer:"Eco Detergent", color:"from-emerald-500 to-teal-500" },
];

const CATEGORIES = [
  { id:"all", label:"All Services", icon: LayoutGrid, price:"From ₹45/kg", bg:"bg-slate-900 text-white" },
  { id:"wash", label:"Wash & Fold", icon: WashingMachine, price:"From ₹45/kg", bg:"bg-blue-600 text-white" },
  { id:"ironing", label:"Ironing", icon: Zap, price:"From ₹20/pc", bg:"bg-orange-500 text-white" },
  { id:"dry", label:"Dry Cleaning", icon: Shirt, price:"From ₹100/kg", bg:"bg-cyan-500 text-white" },
  { id:"pickup", label:"Pickup & Delivery", icon: Bike, price:"At Your Doorstep", bg:"bg-indigo-600 text-white" },
  { id:"shoe", label:"Shoe Care", icon: Footprints, price:"From ₹149/pair", bg:"bg-emerald-500 text-white" },
  { id:"premium", label:"Premium Care", icon: Gem, price:"From ₹199/pc", bg:"bg-violet-600 text-white" },
];

const INITIAL_BOOKINGS: Booking[] = [
  { id:"BB-2841", partner:"SmartWash Laundry", service:"Wash & Fold • 4 kg", qty:4, price:180, status:"In Process", date:"Today, 12 May", slot:"Pickup 4:00 PM", img:PARTNERS[2].img },
  { id:"BB-2790", partner:"FreshWash Laundry", service:"Dry Cleaning • 2 pcs", qty:2, price:320, status:"Ready", date:"Yesterday", slot:"Delivered 7:30 PM", img:PARTNERS[0].img },
];

export default function App() {
  const account = useSelector((state: any) => state.auth.user);
  const user = account ? { name: account.Name || account.name, email: account.Email || account.email } : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signOut = () => { dispatch(logout()); dispatch(api.util.resetApiState()); navigate("/login"); };
  const [tab, setTab] = useState<"home"|"bookings"|"track"|"wallet"|"profile">("home");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [location, setLocation] = useState("Bhubaneswar");
  const [locOpen, setLocOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [favs, setFavs] = useState<number[]>([1,3]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [qty, setQty] = useState(3);
  const [service, setService] = useState("Wash & Fold");
  const [slot, setSlot] = useState("Today • 4 PM");
  const [coupon, setCoupon] = useState(true);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState("");
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [trackStep, setTrackStep] = useState(1);

  const showToast = (msg: string) => { setToast(msg); setTimeout(()=>setToast(""), 3200); };
  const toggleFav = (id:number) => setFavs(f => f.includes(id) ? f.filter(x=>x!==id) : [...f,id]);

  const filtered = useMemo(()=>{
    return PARTNERS.filter(p=>{
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase());
      if(!matchSearch) return false;
      if(cat==="all") return true;
      if(cat==="wash") return p.services.some(s=>s.includes("Wash"));
      if(cat==="ironing") return p.services.some(s=>s.includes("Iron"));
      if(cat==="dry") return p.services.some(s=>s.includes("Dry"));
      return true;
    });
  },[search,cat]);

  const totalPrice = selected ? Math.round(priceFor(selected, service) * qty * (coupon?0.9:1)) : 0;

  const confirmBooking = () => { setSelected(null); showToast("Preview only — no order or payment was created."); };

  const copyCode = async (code:string) => { try { await navigator.clipboard.writeText(code); } catch { showToast(`Sample code: ${code}`); return; } setCopied(code); showToast(`Code ${code} copied!`); setTimeout(()=>setCopied(""),2000); };

  const dockItems = [
    { id:"home" as const, label:"Home", icon: Home },
    { id:"bookings" as const, label:"Bookings", icon: CalendarDays, badge: bookings.length },
    { id:"track" as const, label:"Track", icon: Truck },
    { id:"wallet" as const, label:"Wallet", icon: Wallet },
    { id:"profile" as const, label:"Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#EEF6FF] overflow-x-hidden pb-32">
      {/* Background decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute top-[40%] -left-40 w-[420px] h-[420px] rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[380px] h-[380px] rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* ============ FLOATING PILL NAVBAR (NEW - replaces Topbar) ============ */}
      <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-50 max-w-7xl mx-auto">
        <div className="glass rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-white/70 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          {/* Logo */}
          <button onClick={()=>setTab("home")} className="flex items-center gap-2.5 shrink-0"><img src="/images/logo.webp" alt="BB LaundryLink" className="preserved-brand"/></button>

          {/* Center links - desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 rounded-full p-1 border border-slate-100">
            {["Home","Partners","Offers","How it Works"].map((l,i)=>(
              <button key={l} onClick={()=>{ if(l==="Home") setTab("home"); else document.getElementById(l.toLowerCase().replace(/ /g,"-"))?.scrollIntoView({behavior:"smooth"}); setTab("home"); }} className={`px-4 py-2 rounded-full text-[13px] font-bold transition ${i===0?"bg-slate-900 text-white shadow":"text-slate-600 hover:text-slate-900"}`}>{l}</button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <button onClick={()=>setLocOpen(!locOpen)} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full pl-3 pr-2 py-2 text-xs font-bold text-slate-700 hover:border-blue-300 transition">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> {location} <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>{locOpen && (
                <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                  {["Bhubaneswar","Cuttack","Puri","Rourkela"].map(c=>(
                    <button key={c} onClick={()=>{setLocation(c); setLocOpen(false); showToast(`Location changed to ${c}`);}} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 flex justify-between items-center">{c} {location===c && <Check className="w-4 h-4 text-blue-600"/>}</button>
                  ))}
                </motion.div>)}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button onClick={()=>setNotifOpen(!notifOpen)} className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-blue-300 transition">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">2</span>
              </button>
              <AnimatePresence>{notifOpen && (
                <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="absolute right-0 top-12 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50">
                  <p className="font-display font-bold text-sm mb-3">Notifications</p>
                  {[{t:"Your order is In Process",s:"SmartWash • BB-2841 • Arriving by 6 PM",i:Truck,c:"bg-blue-100 text-blue-600"},{t:"10% OFF applied!",s:"WELCOME10 is active on your wallet",i:Gift,c:"bg-orange-100 text-orange-600"}].map((n,i)=>(
                    <div key={i} className="flex gap-3 p-3 rounded-2xl hover:bg-slate-50"><div className={`w-10 h-10 rounded-xl ${n.c} flex items-center justify-center shrink-0`}><n.i className="w-5 h-5"/></div><div><p className="text-sm font-bold">{n.t}</p><p className="text-xs text-slate-500">{n.s}</p></div></div>
                  ))}
                </motion.div>)}
              </AnimatePresence>
            </div>

            <button onClick={()=>setTab("profile")} className="flex items-center gap-2 bg-slate-900 text-white rounded-full pl-1 pr-3 py-1 hover:bg-slate-800 transition">
              <img src="/images/avatar-sample.webp" alt="Ritika" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
              <span className="text-xs font-bold hidden sm:block">{user?.name?.split(" ")[0] || "Guest"}</span>
            </button>
            <button onClick={()=>document.getElementById("partners")?.scrollIntoView({behavior:"smooth"})} className="hidden sm:flex bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs font-black px-4 py-2.5 rounded-full shadow-lg shadow-blue-500/30 items-center gap-1.5 hover:scale-[1.03] transition">Book Now <ArrowRight className="w-3.5 h-3.5"/></button>
          </div>
        </div>
        {/* New design badge */}
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide"><Sparkles className="w-3 h-3 text-amber-400"/> NEW OFFER COMMIING SOON</span>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 pt-[118px] sm:pt-[128px]"><div className="sample-design-note">Design preview · Sample partners, ratings, reviews, bookings, wallet & tracking. No live booking or payment.</div>
        <AnimatePresence mode="wait">
          {tab==="home" && (
            <motion.div key="home" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.35}}>
              {/* ============ HERO BENTO ============ */}
              <section className="grid lg:grid-cols-12 gap-4">
                {/* Left hero card */}
                <div className="lg:col-span-7 relative overflow-hidden rounded-[32px] bg-white border border-white shadow-[0_20px_60px_rgba(37,99,235,0.12)] p-5 sm:p-8">
                  <div className="absolute -right-10 -top-10 w-56 h-56 bg-sky-100 rounded-full blur-2xl" />
                  <div className="absolute right-24 top-6 w-10 h-10 rounded-full border-2 border-sky-200 animate-bubble hidden sm:block" />
                  <div className="absolute right-40 top-16 w-5 h-5 rounded-full bg-orange-200 animate-bubble hidden sm:block" style={{animationDelay:".6s"}} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black px-2.5 py-1 rounded-full">👋 Welcome Back</span>
                      <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black px-2.5 py-1 rounded-full"><BadgeCheck className="w-3.5 h-3.5"/> Verified User</span>
                    </div>
                    <h1 className="font-display font-black text-[34px] sm:text-[52px] leading-[0.95] tracking-tight text-slate-900">
                      {user?.name || "Guest"} <span className="text-gradient-blue">✦</span><br/>
                      <span className="text-gradient-blue">Your Clothes...</span><br/>
                      <span className="text-gradient-orange">Our Priority!</span>
                    </h1>
                    <p className="mt-3 text-slate-600 font-medium text-sm sm:text-base max-w-md">Find the best laundry near you in <b className="text-slate-900">{location}</b>. Clean • Fresh • On Time — pickup from your doorstep in 30 minutes.</p>

                    {/* Big Search Pill */}
                    <div className="mt-5 bg-slate-50 border border-slate-200 rounded-[24px] sm:rounded-full p-2 flex flex-col sm:flex-row gap-2 shadow-inner">
                      <div className="flex items-center gap-2 flex-1 px-3">
                        <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Your Location</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{location} ▾</p>
                        </div>
                      </div>
                      <div className="hidden sm:block w-px bg-slate-200" />
                      <div className="flex items-center gap-2 flex-[1.4] px-3 bg-white sm:bg-transparent rounded-full border sm:border-0 border-slate-200 py-2 sm:py-0">
                        <Search className="w-5 h-5 text-slate-400 shrink-0" />
                        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search laundry services..." className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-slate-400" />
                      </div>
                      <button onClick={()=>document.getElementById("partners")?.scrollIntoView({behavior:"smooth"})} className="bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition"><Search className="w-4 h-4"/> Search</button>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {["/images/avatar-sample.webp","/images/avatar-sample.webp","/images/avatar-sample.webp"].map((s,i)=>(<img key={i} src={s} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt=""/>))}
                        </div>
                        <div className="leading-tight"><p className="text-xs font-black">12k+ Happy Users</p><p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400"/> 4.8 Rating</p></div>
                      </div>
                      <div className="h-8 w-px bg-slate-200 hidden sm:block"/>
                      <div className="leading-tight"><p className="text-sm font-black">120+ Partners</p><p className="text-[11px] text-slate-500 font-semibold">Near {location}</p></div>
                      <div className="h-8 w-px bg-slate-200 hidden sm:block"/>
                      <div className="leading-tight"><p className="text-sm font-black flex items-center gap-1"><Timer className="w-4 h-4 text-blue-600"/> 30 Min Pickup</p><p className="text-[11px] text-slate-500 font-semibold">Express Delivery</p></div>
                    </div>
                  </div>
                </div>

                {/* Right hero bento image */}
                <div className="lg:col-span-5 relative rounded-[32px] overflow-hidden min-h-[340px] shadow-[0_20px_60px_rgba(15,23,42,0.18)] group">
                  <img src="/images/landing-fresh.webp" alt="Fresh laundry" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="glass rounded-full px-3 py-1.5 text-[11px] font-black text-slate-800 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-orange-500"/> Freshness in Every Wash</span>
                    <span className="bg-white rounded-full px-2.5 py-1 text-[11px] font-black flex items-center gap-1 shadow"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/> 4.8</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    <div className="glass flex-1 rounded-2xl p-3.5">
                      <p className="text-[10px] font-black tracking-wider text-slate-500 uppercase">Live Order</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">BB-2841 • In Process</p>
                      <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-[62%] bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"/></div>
                      <p className="text-[11px] font-bold text-blue-700 mt-1.5">Arriving by 6:00 PM today</p>
                    </div>
                    <button onClick={()=>setTab("track")} className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-4 font-black text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-orange-500/40 transition"><Truck className="w-5 h-5"/> Track</button>
                  </div>
                  <div className="absolute top-[38%] right-4 glass rounded-2xl px-3 py-2 animate-floaty hidden sm:flex items-center gap-2"><Gift className="w-4 h-4 text-orange-500"/><div className="leading-none"><p className="text-[11px] font-black">10% OFF</p><p className="text-[10px] font-bold text-slate-500">WELCOME10</p></div></div>
                </div>
              </section>

              {/* Marquee strip */}
              <div className="mt-4 bg-slate-900 rounded-full overflow-hidden py-2.5">
                <div className="flex whitespace-nowrap animate-marquee gap-8 text-white text-xs font-bold">
                  {Array(2).fill(["✦ 100% Secure & Trusted","✦ 24/7 Support","✦ Free Pickup in Bhubaneswar","✦ Fresh Clothes, Happier You","✦ 120+ Verified Partners","✦ Express 30 Min Delivery"]).flat().map((t,i)=>(<span key={i} className="flex items-center gap-2">{t}</span>))}
                </div>
              </div>

              {/* Categories */}
              <section className="mt-6">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="font-display font-black text-lg sm:text-xl flex items-center gap-2"><Sparkle className="w-5 h-5 text-orange-500 fill-orange-500"/> What do you need today?</h2>
                  <button className="text-xs font-black text-blue-600 flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5"/></button>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                  {CATEGORIES.map(c=>{
                    const active = cat===c.id;
                    return (
                      <button key={c.id} onClick={()=>setCat(c.id)} className={`shrink-0 w-[168px] text-left rounded-[24px] p-4 border-2 transition-all ${active?"border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]":"bg-white border-white hover:border-blue-200 shadow-sm"}`}>
                        <div className={`w-11 h-11 rounded-2xl ${active?c.bg:"bg-blue-50 text-blue-600"} flex items-center justify-center mb-3`}><c.icon className="w-6 h-6"/></div>
                        <p className={`font-black text-sm leading-tight ${active?"text-white":"text-slate-900"}`}>{c.label}</p>
                        <p className={`text-[11px] font-bold mt-1 ${active?"text-slate-300":"text-slate-500"}`}>{c.price}</p>
                        <p className={`mt-3 text-[11px] font-black flex items-center gap-1 ${active?"text-sky-300":"text-blue-600"}`}>Book Now <ArrowRight className="w-3 h-3"/></p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* BENTO GRID: Partners (8) + Track/Wallet/Offer (4) */}
              <section id="partners" className="mt-6 grid lg:grid-cols-12 gap-4 scroll-mt-36">
                <div className="lg:col-span-8 bg-white rounded-[32px] border border-white shadow-[0_16px_50px_rgba(37,99,235,0.10)] p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="font-display font-black text-xl flex items-center gap-2"><Star className="w-6 h-6 fill-amber-400 text-amber-400"/> Nearby Laundry Partners</h2>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">{filtered.length} partners near you</span>
                      <button onClick={()=>setViewMode(viewMode==="grid"?"list":"grid")} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">{viewMode==="grid"?<List className="w-4 h-4"/>:<LayoutGrid className="w-4 h-4"/>}</button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {["All","Wash & Fold","Ironing","Dry Cleaning"].map(s=>(
                      <button key={s} onClick={()=>{ if(s==="All") setCat("all"); else if(s==="Wash & Fold") setCat("wash"); else if(s==="Ironing") setCat("ironing"); else setCat("dry"); }} className={`shrink-0 px-4 py-2 rounded-full text-xs font-black border transition ${ (s==="All"&&cat==="all")||(s==="Wash & Fold"&&cat==="wash")||(s==="Ironing"&&cat==="ironing")||(s==="Dry Cleaning"&&cat==="dry") ? "bg-blue-600 text-white border-blue-600":"bg-white text-slate-600 border-slate-200"}`}>{s}</button>
                    ))}
                    <span className="ml-auto shrink-0 inline-flex items-center gap-1 text-xs font-bold text-slate-500 px-2"><SlidersHorizontal className="w-3.5 h-3.5"/> Sort: Nearest</span>
                  </div>

                  <div className={viewMode==="grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                    {filtered.map((p,idx)=>(
                      <motion.article key={p.id} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:idx*0.06}} className={`group bg-white border border-slate-100 rounded-[24px] overflow-hidden hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all ${viewMode==="list"?"sm:flex":""}`}>
                        <div className={`relative ${viewMode==="list"?"sm:w-56 shrink-0":""} h-40 overflow-hidden`}>
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[11px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow"><Star className="w-3 h-3 fill-emerald-500 text-emerald-500"/> {p.rating} <span className="text-slate-400 font-bold">({p.reviews})</span></span>
                          <button aria-label={`Favorite ${p.name}`} aria-pressed={favs.includes(p.id)} onClick={()=>toggleFav(p.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow hover:scale-110 transition"><Heart className={`w-4 h-4 ${favs.includes(p.id)?"fill-red-500 text-red-500":"text-slate-600"}`}/></button>
                          <span className={`absolute bottom-3 left-3 bg-gradient-to-r ${p.color} text-white text-[10px] font-black px-2.5 py-1 rounded-full`}>{p.tag}</span>
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-black text-[15px] leading-tight">{p.name}</h3>
                            <div className="text-right shrink-0"><p className="font-black text-blue-600">₹{p.price}<span className="text-[11px] text-slate-400">/kg</span></p><p className="text-[11px] text-slate-400 line-through font-bold">₹{p.mrp}/kg</p></div>
                          </div>
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-blue-500"/> {p.area}</p>
                          <div className="flex gap-3 mt-2 text-[11px] font-bold text-slate-600">
                            <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5"/> {p.distance}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {p.time}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">{p.services.map(s=>(<span key={s} className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{s}</span>))}</div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[11px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full">{p.offer}</span>
                            <button onClick={()=>{setService(p.services[0]); setSelected(p); setQty(3);}} className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-1.5 transition">Book Now <ArrowRight className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                    {filtered.length===0 && <div className="col-span-full text-center py-12"><p className="font-black text-slate-700">No partners found</p><p className="text-sm text-slate-500">Try a different search or category</p><button onClick={()=>{setSearch(""); setCat("all");}} className="mt-3 bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full">Clear Filters</button></div>}
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Track card */}
                  <div className="bg-white rounded-[28px] border border-white shadow-[0_16px_50px_rgba(37,99,235,0.10)] p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-black flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center"><Truck className="w-5 h-5"/></span> Track Your Order</h3>
                      <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded-full">LIVE</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Live Order Tracking • BB-2841</p>
                    <div className="mt-5 relative">
                      <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 rounded-full"><div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all" style={{width:`${trackStep*33}%`}}/></div>
                      <div className="relative flex justify-between">
                        {["Picked Up","In Process","Ready","Delivered"].map((s,i)=>(
                          <button key={s} onClick={()=>setTrackStep(i)} className="flex flex-col items-center gap-1.5 w-16">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${i<=trackStep?"bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30":"bg-white border-slate-200 text-slate-400"}`}>{i<trackStep?<Check className="w-4 h-4"/>:<span className="text-[11px] font-black">{i+1}</span>}</span>
                            <span className={`text-[10px] font-black text-center leading-tight ${i<=trackStep?"text-slate-900":"text-slate-400"}`}>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={()=>setTab("track")} className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-full flex items-center justify-center gap-2 transition">Track Now <ArrowRight className="w-4 h-4"/></button>
                  </div>

                  {/* Wallet mini */}
                  <div className="bg-slate-900 text-white rounded-[28px] p-5 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-36 h-36 bg-blue-600/40 rounded-full blur-2xl"/>
                    <div className="relative flex justify-between items-start">
                      <div><p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">BB Wallet</p><p className="font-display font-black text-3xl mt-1">₹1,250</p><p className="text-xs text-slate-400 font-semibold mt-1">₹250 cashback available</p></div>
                      <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><Wallet className="w-5 h-5"/></span>
                    </div>
                    <div className="relative flex gap-2 mt-4">
                      <button onClick={()=>showToast("Wallet top-up is not connected. No money was added.")} className="flex-1 bg-white text-slate-900 font-black text-xs py-2.5 rounded-full">+ Add Money</button>
                      <button onClick={()=>setTab("wallet")} className="flex-1 bg-white/10 font-black text-xs py-2.5 rounded-full border border-white/20">History</button>
                    </div>
                  </div>

                  {/* Offer card */}
                  <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white p-5 relative shadow-[0_16px_40px_rgba(37,99,235,0.35)]">
                    <Gift className="absolute -right-4 -bottom-4 w-28 h-28 text-white/10 rotate-12"/>
                    <p className="font-display font-black text-xl leading-tight">Get 10% OFF<br/><span className="text-sky-200 text-sm font-bold">on Your First Booking</span></p>
                    <button onClick={()=>copyCode("WELCOME10")} className="mt-3 inline-flex items-center gap-2 bg-white/15 border border-dashed border-white/50 rounded-full px-3 py-1.5 text-xs font-black">Use Code: WELCOME10 {copied==="WELCOME10"?<Check className="w-3.5 h-3.5"/>:<Copy className="w-3.5 h-3.5"/>}</button>
                    <button onClick={()=>document.getElementById("partners")?.scrollIntoView({behavior:"smooth"})} className="mt-3 block bg-orange-500 text-white text-xs font-black px-4 py-2.5 rounded-full">Book Now →</button>
                  </div>

                  {/* Smart City */}
                  <div className="bg-white rounded-[28px] border border-white shadow-sm p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shrink-0"><Store className="w-8 h-8"/></div>
                    <div className="flex-1"><p className="font-black text-sm">Smart City Bhubaneswar ❤️</p><p className="text-xs text-slate-500 font-semibold">BB LaundryLink • Your Laundry, Our Care</p></div>
                    <ChevronRight className="w-5 h-5 text-slate-400"/>
                  </div>
                </div>
              </section>

              {/* How it works */}
              <section id="how-it-works" className="mt-6 bg-white rounded-[32px] border border-white shadow-sm p-5 sm:p-7 scroll-mt-36">
                <h2 className="font-display font-black text-xl text-center">How it works <span className="text-gradient-orange">— 3 Simple Steps</span></h2>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  {[{n:"01",t:"Book in 30 Seconds",d:"Choose your laundry partner & service. Pay online or via wallet.",i:CalendarClock,c:"bg-blue-600"},{n:"02",t:"We Pickup at Doorstep",d:"Our delivery partner picks up your clothes from home. Free pickup!",i:Bike,c:"bg-orange-500"},{n:"03",t:"Fresh Delivery in 24 hrs",d:"Clean, pressed & packed fresh. Delivered to your door, on time.",i:Package,c:"bg-emerald-500"}].map((s,i)=>(
                    <div key={i} className="relative text-center p-5 rounded-[24px] bg-slate-50 border border-slate-100">
                      <span className="absolute top-3 right-4 font-display font-black text-2xl text-slate-200">{s.n}</span>
                      <div className={`w-14 h-14 mx-auto rounded-2xl ${s.c} text-white flex items-center justify-center shadow-lg`}><s.i className="w-7 h-7"/></div>
                      <p className="font-black mt-3">{s.t}</p><p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{s.d}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Offers */}
              <section id="offers" className="mt-6 scroll-mt-36">
                <h2 className="font-display font-black text-xl mb-3 flex items-center gap-2 px-1"><BadgePercent className="w-6 h-6 text-orange-500"/> Offers & Deals for You</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[{code:"WELCOME10",t:"10% OFF First Order",d:"Up to ₹150 off • Min ₹299",g:"from-orange-500 to-amber-500"},{code:"FREEPICKUP",t:"Free Pickup & Delivery",d:"On all orders above ₹199",g:"from-blue-600 to-sky-500"},{code:"WASH3GET1",t:"Buy 3kg Get 1kg Free",d:"Every Monday • Bhubaneswar",g:"from-violet-600 to-indigo-500"}].map((o,i)=>(
                    <div key={i} className={`rounded-[24px] bg-gradient-to-br ${o.g} text-white p-5 relative overflow-hidden`}>
                      <p className="font-display font-black text-lg leading-tight">{o.t}</p><p className="text-xs font-semibold text-white/80 mt-1">{o.d}</p>
                      <button onClick={()=>copyCode(o.code)} className="mt-4 bg-white text-slate-900 text-xs font-black px-3 py-2 rounded-full flex items-center gap-1.5">{o.code} {copied===o.code?<Check className="w-3.5 h-3.5 text-emerald-600"/>:<Copy className="w-3.5 h-3.5"/>}</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Trust strip */}
              <section className="mt-6 bg-white rounded-[28px] border border-white shadow-sm px-5 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{i:ShieldCheck,t:"100% Secure",s:"& Trusted",c:"text-blue-600 bg-blue-50"},{i:BadgeCheck,t:"Trusted",s:"Partners",c:"text-indigo-600 bg-indigo-50"},{i:Headphones,t:"24/7",s:"Support",c:"text-orange-600 bg-orange-50"},{i:Heart,t:"Fresh Clothes,",s:"Happier You",c:"text-rose-600 bg-rose-50"}].map((x,i)=>(
                  <div key={i} className="flex items-center gap-3 justify-center"><span className={`w-11 h-11 rounded-2xl ${x.c} flex items-center justify-center`}><x.i className="w-6 h-6"/></span><div className="leading-tight"><p className="font-black text-sm">{x.t}</p><p className="text-xs text-slate-500 font-bold">{x.s}</p></div></div>
                ))}
              </section>
              <p className="text-center mt-6 text-xs font-bold text-slate-400">BB LaundryLink — Your Laundry, Our Care ❤️ • Made for Smart City Bhubaneswar</p>
            </motion.div>
          )}

          {tab==="bookings" && (
            <motion.div key="bookings" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="font-display font-black text-2xl">My Bookings</h2><span className="bg-white border px-3 py-1.5 rounded-full text-xs font-black">{bookings.length} Orders</span></div>
              {bookings.map(b=>(
                <div key={b.id} className="bg-white rounded-[28px] border border-white shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                  <img src={b.img} className="w-full sm:w-36 h-32 object-cover rounded-2xl" alt=""/>
                  <div className="flex-1">
                    <div className="flex justify-between gap-2"><div><p className="font-black">{b.partner}</p><p className="text-xs font-bold text-slate-500">{b.service} • {b.id}</p></div><span className={`h-fit text-[11px] font-black px-2.5 py-1 rounded-full ${b.status==="Ready"?"bg-emerald-100 text-emerald-700":"bg-blue-100 text-blue-700"}`}>{b.status}</span></div>
                    <p className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-3"><span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5"/> {b.date}</span><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {b.slot}</span></p>
                    <div className="flex items-center justify-between mt-3"><p className="font-black text-lg">₹{b.price} <span className="text-xs text-slate-400 font-bold">paid via Wallet</span></p><div className="flex gap-2"><button onClick={()=>setTab("track")} className="bg-slate-900 text-white text-xs font-black px-4 py-2 rounded-full">Track</button><button onClick={()=>{setBookings(bookings.filter(x=>x.id!==b.id)); showToast("Booking cancelled");}} className="bg-red-50 text-red-600 text-xs font-black px-3 py-2 rounded-full flex items-center gap-1"><Trash2 className="w-3.5 h-3.5"/> Cancel</button></div></div>
                  </div>
                </div>
              ))}
              <button onClick={()=>setTab("home")} className="w-full bg-blue-600 text-white font-black py-4 rounded-full">+ Book New Laundry</button>
            </motion.div>
          )}

          {tab==="track" && (
            <motion.div key="track" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 bg-white rounded-[32px] border border-white shadow-sm p-6">
                <h2 className="font-display font-black text-2xl">Track Your Order</h2>
                <p className="text-sm font-semibold text-slate-500">Order BB-2841 • SmartWash Laundry • Wash & Fold 4kg</p>
                <div className="mt-8 relative">
                  <div className="absolute left-5 top-2 bottom-2 w-1 bg-slate-100 rounded-full"><div className="w-full bg-gradient-to-b from-blue-600 to-sky-400 rounded-full transition-all" style={{height:`${trackStep*33}%`}}/></div>
                  <div className="space-y-6 relative">
                    {[{t:"Order Placed",d:"Today, 10:24 AM • Payment confirmed",i:CircleCheck},{t:"Picked Up",d:"Today, 11:05 AM • By Ramesh (Delivery Partner)",i:Bike},{t:"In Process — Washing & Ironing",d:"SmartWash, IRC Village • ETA 6:00 PM",i:WashingMachine},{t:"Ready for Delivery",d:"Packed fresh • Out for delivery soon",i:Package},{t:"Delivered",d:"Expected by 8:00 PM today",i:Home}].map((s,i)=>(
                      <div key={i} className="flex gap-4">
                        <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${i<=trackStep?"bg-blue-600 border-blue-600 text-white":"bg-white border-slate-200 text-slate-400"}`}><s.i className="w-5 h-5"/></span>
                        <button onClick={()=>setTrackStep(i)} className="text-left flex-1 pb-1"><p className={`font-black ${i<=trackStep?"text-slate-900":"text-slate-400"}`}>{s.t}</p><p className="text-xs font-semibold text-slate-500">{s.d}</p></button>
                        {i===trackStep && <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded-full h-fit">CURRENT</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                  <img src="/images/avatar-sample.webp" className="w-12 h-12 rounded-full object-cover" alt=""/>
                  <div className="flex-1"><p className="font-black text-sm">Ramesh Kumar • Delivery Partner</p><p className="text-xs font-semibold text-slate-500">4.9 ★ • 1,240 deliveries • OD-02-AB-4521</p></div>
                  <button onClick={()=>showToast("Calling Ramesh...")} className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Phone className="w-5 h-5"/></button>
                </div>
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 text-white rounded-[32px] p-6 relative overflow-hidden">
                  <Route className="absolute -right-6 -bottom-6 w-36 h-36 text-white/10"/>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Delivery</p>
                  <p className="font-display font-black text-4xl mt-2">6:00 PM</p>
                  <p className="text-sm text-slate-300 font-semibold mt-1">Today • 12 May • On Time</p>
                  <div className="mt-5 h-2.5 bg-white/15 rounded-full overflow-hidden"><div className="h-full w-[62%] bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"/></div>
                  <p className="text-xs font-bold mt-2 text-sky-300">62% completed • Washing in progress</p>
                </div>
                <div className="bg-white rounded-[28px] border border-white shadow-sm p-5">
                  <p className="font-black mb-3">Order Summary</p>
                  {[["Wash & Fold (4 kg)","₹180"],["Pickup & Delivery","FREE"],["Discount WELCOME10","-₹18"],["Total Paid","₹162"]].map((r,i)=>(<div key={i} className={`flex justify-between py-2 text-sm font-bold ${i===3?"border-t mt-2 pt-3 text-base font-black":"text-slate-600"}`}><span>{r[0]}</span><span>{r[1]}</span></div>))}
                </div>
              </div>
            </motion.div>
          )}

          {tab==="wallet" && (
            <motion.div key="wallet" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-[32px] p-6 relative overflow-hidden">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Balance</p>
                <p className="font-display font-black text-5xl mt-2">₹1,250</p>
                <p className="text-sm text-slate-300 font-semibold mt-1">+ ₹250 cashback pending</p>
                <div className="flex gap-2 mt-6"><button onClick={()=>showToast("Wallet top-up is not connected. No money was added.")} className="flex-1 bg-white text-slate-900 font-black py-3 rounded-full text-sm">+ Add Money</button><button className="flex-1 bg-white/10 border border-white/20 font-black py-3 rounded-full text-sm">Send</button></div>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold">{[["UPI","Pay"],["Card","Pay"],["NetBank","Pay"]].map(x=>(<div key={x[0]} className="bg-white/10 rounded-2xl py-3"><CreditCard className="w-5 h-5 mx-auto mb-1"/>{x[0]}</div>))}</div>
              </div>
              <div className="lg:col-span-7 bg-white rounded-[32px] border border-white shadow-sm p-6">
                <p className="font-display font-black text-lg mb-4">Recent Transactions</p>
                {[{name:"SmartWash Laundry",meta:"Today • BB-2841",amt:"-₹162",cls:"bg-blue-100 text-blue-600",Icon:WashingMachine},{name:"Wallet Top-up",meta:"Yesterday",amt:"+₹500",cls:"bg-emerald-100 text-emerald-600",Icon:Plus},{name:"FreshWash Laundry",meta:"10 May • BB-2790",amt:"-₹320",cls:"bg-orange-100 text-orange-600",Icon:Shirt},{name:"Cashback Credited",meta:"9 May",amt:"+₹50",cls:"bg-violet-100 text-violet-600",Icon:Gift}].map((t,i)=>(
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                    <span className={`w-11 h-11 rounded-2xl ${t.cls} flex items-center justify-center`}><t.Icon className="w-5 h-5"/></span>
                    <div className="flex-1"><p className="font-black text-sm">{t.name}</p><p className="text-xs font-semibold text-slate-500">{t.meta}</p></div>
                    <p className={`font-black ${t.amt.includes("+")?"text-emerald-600":"text-slate-900"}`}>{t.amt}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab==="profile" && (
            <motion.div key="profile" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4 bg-white rounded-[32px] border border-white shadow-sm p-6 text-center">
                <img src="/images/avatar-sample.webp" className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-100" alt=""/>
                <p className="font-display font-black text-xl mt-3 flex items-center justify-center gap-1.5">{user?.name || "Guest"} <BadgeCheck className="w-5 h-5 text-blue-600 fill-blue-600"/></p>
                <p className="text-sm font-semibold text-slate-500">{user?.email || "Preview account"}</p>
                <div className="grid grid-cols-3 gap-2 mt-5">{[["12","Orders"],["₹1,250","Wallet"],["4.8","Rating"]].map(x=>(<div key={x[1]} className="bg-slate-50 rounded-2xl py-3"><p className="font-black">{x[0]}</p><p className="text-[10px] font-bold text-slate-500 uppercase">{x[1]}</p></div>))}</div>
                <button onClick={signOut} className="mt-5 w-full bg-red-50 text-red-600 font-black py-3 rounded-full flex items-center justify-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
              </div>
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white rounded-[28px] border border-white shadow-sm p-5">
                  <p className="font-black mb-3">Saved Addresses</p>
                  {[["Home","Plot 42, Patia, Bhubaneswar - 751024","bg-blue-600"],["Office","KIIT Square, Patia, BBSR","bg-orange-500"]].map((a,i)=>(<div key={i} className="flex gap-3 p-3 rounded-2xl bg-slate-50 mb-2"><span className={`w-9 h-9 rounded-xl ${a[2]} text-white flex items-center justify-center shrink-0`}><MapPin className="w-4 h-4"/></span><div><p className="font-black text-sm">{a[0]}</p><p className="text-xs font-semibold text-slate-500">{a[1]}</p></div></div>))}
                </div>
                <div className="bg-white rounded-[28px] border border-white shadow-sm p-5 space-y-3">
                  <p className="font-black">Preferences</p>
                  {[["Push Notifications",true],["Order Updates on WhatsApp",true],["Email Offers & Deals",false]].map((p,i)=>(
                    <div key={i} className="flex items-center justify-between py-2"><span className="text-sm font-bold">{p[0]}</span><button onClick={()=>showToast("Preference updated")} className={`w-12 h-7 rounded-full p-1 transition ${p[1]?"bg-blue-600":"bg-slate-200"}`}><span className={`block w-5 h-5 bg-white rounded-full shadow transition ${p[1]?"translate-x-5":""}`}/></button></div>
                  ))}
                  <div className="flex items-center justify-between py-2 border-t"><span className="text-sm font-bold flex items-center gap-2"><Settings className="w-4 h-4"/> Account Settings</span><ChevronRight className="w-4 h-4 text-slate-400"/></div>
                  <div className="flex items-center justify-between py-2"><span className="text-sm font-bold flex items-center gap-2"><Headphones className="w-4 h-4"/> Help & Support (24/7)</span><ChevronRight className="w-4 h-4 text-slate-400"/></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ============ BOTTOM FLOATING DOCK (NEW - replaces Sidebar) ============ */}
      <nav aria-label="Dashboard navigation" className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto glass-dark rounded-full shadow-[0_20px_50px_rgba(15,23,42,0.45)] border border-white/10 p-1.5 flex items-center gap-1">
          {dockItems.map(item=>{
            const active = tab===item.id;
            return (
              <button key={item.id} onClick={()=>{setTab(item.id); window.scrollTo({top:0,behavior:"smooth"});}} className="relative flex flex-col items-center gap-0.5 px-3 sm:px-5 py-2 rounded-full transition">
                {active && <motion.span layoutId="dock-active" className="absolute inset-0 bg-white rounded-full" transition={{type:"spring",stiffness:400,damping:30}}/>}
                <span className="relative z-10 flex items-center gap-1">
                  <item.icon className={`w-5 h-5 ${active?"text-slate-900":"text-slate-300"}`}/>
                  {item.badge ? <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span> : null}
                </span>
                <span className={`relative z-10 text-[10px] font-black ${active?"text-slate-900":"text-slate-400"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Booking Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3" onClick={()=>setSelected(null)}>
            <motion.div role="dialog" aria-modal="true" aria-label="Partner preview" tabIndex={-1} data-design-dialog="true" initial={{y:40,opacity:0,scale:.98}} animate={{y:0,opacity:1,scale:1}} exit={{y:40,opacity:0}} onClick={e=>e.stopPropagation()} className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto">
              <div className="relative h-44">
                <img src={selected.img} className="w-full h-full object-cover" alt=""/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <button aria-label="Close booking preview" onClick={()=>setSelected(null)} className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow"><X className="w-5 h-5"/></button>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="font-display font-black text-xl">{selected.name}</p>
                  <p className="text-xs font-bold text-white/80 flex items-center gap-2 mt-1"><span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/> {selected.rating}</span> • {selected.area} • {selected.distance}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-black tracking-wider text-slate-400 uppercase mb-2">Select Service</p>
                  <div className="flex flex-wrap gap-2">{selected.services.map(s=>(<button key={s} onClick={()=>setService(s)} className={`px-4 py-2.5 rounded-full text-xs font-black border-2 transition ${service===s?"bg-slate-900 text-white border-slate-900":"bg-white border-slate-200"}`}>{s}</button>))}</div>
                </div>
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3">
                  <div><p className="text-xs font-black tracking-wider text-slate-400 uppercase">Quantity</p><p className="font-black text-sm">{service==="Ironing"?"Pieces":"Kilograms"}</p></div>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>setQty(Math.max(1,qty-1))} className="w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm"><Minus className="w-4 h-4"/></button>
                    <span className="font-display font-black text-xl w-8 text-center">{qty}</span>
                    <button onClick={()=>setQty(qty+1)} className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow"><Plus className="w-4 h-4"/></button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black tracking-wider text-slate-400 uppercase mb-2">Pickup Slot</p>
                  <div className="grid grid-cols-3 gap-2">{["Today • 2 PM","Today • 4 PM","Today • 6 PM","Tomorrow • 9 AM","Tomorrow • 12 PM","Tomorrow • 4 PM"].map(s=>(<button key={s} onClick={()=>setSlot(s)} className={`py-2.5 rounded-xl text-[11px] font-black border-2 transition ${slot===s?"bg-blue-600 text-white border-blue-600":"bg-white border-slate-200"}`}>{s}</button>))}</div>
                </div>
                <label className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-2xl p-3 cursor-pointer">
                  <span className="text-sm font-black flex items-center gap-2"><Gift className="w-4 h-4 text-orange-500"/> Apply WELCOME10 (10% OFF)</span>
                  <input type="checkbox" checked={coupon} onChange={e=>setCoupon(e.target.checked)} className="w-5 h-5 accent-orange-500"/>
                </label>
                <div className="border-t pt-3 space-y-1.5 text-sm font-bold text-slate-600">
                  <div className="flex justify-between"><span>{service} × {qty}</span><span>₹{priceFor(selected, service)*qty}</span></div>
                  {coupon && <div className="flex justify-between text-emerald-600"><span>Discount (10%)</span><span>-₹{Math.round(priceFor(selected, service)*qty*0.1)}</span></div>}
                  <div className="flex justify-between"><span>Pickup & Delivery</span><span className="text-emerald-600">FREE</span></div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t"><span>Sample total</span><span>₹{totalPrice}</span></div>
                </div>
                <button onClick={confirmBooking} className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black py-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">Preview Booking • ₹{totalPrice} <ArrowRight className="w-4 h-4"/></button>
                <p className="text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> 100% Secure • Free cancellation till pickup</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap max-w-[92vw] overflow-hidden text-ellipsis"><CircleCheck className="w-4 h-4 text-emerald-400 shrink-0"/> {toast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
