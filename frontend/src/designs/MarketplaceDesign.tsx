import { estimateLaundry } from "../utils/estimateLaundry";
import { samplePartners } from "../data/samplePartners";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, CalendarDays, Truck, Wallet, User, Bell, MapPin, Search, Star, Heart,
  Clock, Navigation, ChevronDown, ArrowRight, Sparkles, Shirt, WashingMachine,
  Zap, Gem, Bike, Check, X, Plus, Minus, Gift, ShieldCheck,
  Headphones, Timer,
  Package, CircleCheck, Store,
  CalendarClock, BadgePercent, Menu, Scale, IndianRupee, ArrowUpRight,
  Play, Quote, ChevronUp, Smartphone, Download, Users, TrendingUp, Award
} from "lucide-react";

/* ============================================================
   BB LAUNDRYLINK — UNIQUE HOMEPAGE (Not like screenshot)
   Screenshot = normal hero left/right + strip + 3 cards
   UNIQUE = Circular rotating hero + Expandable services +
            Live Price Calculator + Compare Partners +
            Bento stats + Marquee testimonials + Phone mockup
   ============================================================ */

function priceFor(partner: { name: string; price: number }, service: string) {
  const shop = samplePartners.find(item => item.name === partner.name);
  return shop?.rates?.[service] ?? partner.price;
}

type Partner = { id:number; name:string; area:string; rating:number; reviews:number; price:number; mrp:number; distance:string; time:string; img:string; tag:string; services:string[]; offer:string; color:string; };
type Booking = { id:string; partner:string; service:string; qty:number; price:number; status:string; date:string; slot:string; img:string; };

const PARTNERS: Partner[] = [
  { id:1, name:"FreshWash Laundry", area:"Patia, Bhubaneswar", rating:4.6, reviews:1240, price:50, mrp:70, distance:"1.2 km", time:"30 mins", img:"/images/bento-freshwash.webp", tag:"Most Loved", services:["Wash & Fold","Ironing"], offer:"10% OFF", color:"from-blue-600 to-sky-500" },
  { id:2, name:"CleanCare Laundry", area:"Kharavela Nagar, BBSR", rating:4.5, reviews:980, price:60, mrp:80, distance:"2.1 km", time:"40 mins", img:"/images/bento-cleancare.webp", tag:"Premium Care", services:["Dry Cleaning","Wash & Fold"], offer:"Free Pickup", color:"from-cyan-600 to-blue-600" },
  { id:3, name:"SmartWash Laundry", area:"IRC Village, BBSR", rating:4.7, reviews:2100, price:45, mrp:65, distance:"3.0 km", time:"50 mins", img:"/images/bento-smartwash.webp", tag:"Best Price", services:["Wash & Fold","Ironing","Dry Cleaning"], offer:"₹45/kg only", color:"from-indigo-600 to-blue-500" },
  { id:4, name:"Suds & Shine Hub", area:"Saheed Nagar, BBSR", rating:4.5, reviews:760, price:55, mrp:75, distance:"1.8 km", time:"35 mins", img:"/images/bento-suds.webp", tag:"Express", services:["Wash & Fold"], offer:"30 Min Express", color:"from-sky-500 to-cyan-400" },
  { id:5, name:"UrbanPress Studio", area:"Khandagiri, BBSR", rating:4.9, reviews:1890, price:70, mrp:99, distance:"4.2 km", time:"60 mins", img:"/images/bento-urbanpress.webp", tag:"Top Rated", services:["Dry Cleaning","Ironing"], offer:"Premium Finish", color:"from-blue-700 to-indigo-600" },
  { id:6, name:"EcoWash Hub", area:"Patia, Bhubaneswar", rating:4.6, reviews:640, price:48, mrp:68, distance:"2.5 km", time:"45 mins", img:"/images/landing-fresh.webp", tag:"Eco Friendly", services:["Wash & Fold","Shoe Care"], offer:"Eco Detergent", color:"from-emerald-500 to-teal-500" },
];

const SERVICES = [
  { id:"wash", label:"Wash & Fold", price:"₹45/kg", desc:"Everyday clothes washed, dried & neatly folded. Perfect for daily wear.", img:"/images/landing-fresh.webp", icon:WashingMachine, grad:"from-blue-600" },
  { id:"ironing", label:"Ironing", price:"₹20/pc", desc:"Crisp, wrinkle-free press for shirts, kurtas & formals. Steam finish.", img:"/images/bento-urbanpress.webp", icon:Zap, grad:"from-orange-500" },
  { id:"dry", label:"Dry Cleaning", price:"₹100/kg", desc:"Gentle care for suits, sarees & delicates. Premium solvents only.", img:"/images/bento-cleancare.webp", icon:Shirt, grad:"from-cyan-500" },
  { id:"pickup", label:"Pickup & Delivery", price:"FREE", desc:"Doorstep pickup in 30 mins across Bhubaneswar. Live tracking.", img:"/images/bento-smartwash.webp", icon:Bike, grad:"from-indigo-600" },
  { id:"shoe", label:"Shoe & Premium", price:"₹149/pair", desc:"Shoe deep-clean, bag care & premium fabric treatment.", img:"/images/bento-suds.webp", icon:Gem, grad:"from-violet-600" },
];

const TESTIMONIALS = [
  { name:"Priya Mishra", area:"Patia", text:"Booked at 10 AM, clothes delivered next day perfectly folded. Best laundry app in Bhubaneswar!", stars:5, img:"/images/avatar-sample.webp" },
  { name:"Rahul Sahoo", area:"Saheed Nagar", text:"Compared 3 shops, SmartWash was cheapest. Transparent pricing, no hidden charges. Loved it!", stars:5, img:"/images/avatar-sample.webp" },
  { name:"Ananya Das", area:"IRC Village", text:"Dry cleaning for my saree was premium quality. Pickup boy was polite and on time.", stars:5, img:"/images/avatar-sample.webp" },
  { name:"Sneha Patra", area:"Kharavela Nagar", text:"Wallet cashback + WELCOME10 saved me ₹180. This is my go-to laundry app now.", stars:5, img:"/images/avatar-sample.webp" },
];

const FAQS = [
  { q:"How does BB LaundryLink work?", a:"Enter your area, compare nearby laundry partners by price & rating, book in 30 seconds. We pickup from your doorstep, partner cleans, and we deliver fresh in 24 hours with live tracking." },
  { q:"Is pickup really free?", a:"Yes! Pickup & delivery is FREE on all orders above ₹199 in Bhubaneswar. Below ₹199, a small ₹30 pickup fee applies." },
  { q:"How are prices decided?", a:"Each partner sets their own price (₹45–₹70/kg for Wash & Fold). You see exact price before booking — no hidden charges. Compare tool helps you pick the best." },
  { q:"Can I track my order live?", a:"Absolutely. After booking you get live tracking: Picked Up → In Process → Ready → Delivered, with delivery partner details and ETA." },
  { q:"What if my clothes are damaged?", a:"All partners are verified & insured. In the rare case of damage, BB LaundryLink provides full compensation support within 48 hours." },
];

const ROTATING = ["Effortless.","Fresh.","On Time.","Happier."];

export default function App(){
  const navigate = useNavigate();
  const setMode = (_mode: string) => navigate("/dashboard");
  const [dashTab, setDashTab] = useState<"home"|"bookings"|"track"|"wallet"|"profile">("home");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("Bhubaneswar");
  const [sort, setSort] = useState("nearest");
  const [compare, setCompare] = useState<number[]>([1,3]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selected, setSelected] = useState<Partner|null>(null);
  const [qty, setQty] = useState(3);
  const [service, setService] = useState("Wash & Fold");
  const [slot, setSlot] = useState("Today • 4 PM");
  const [coupon, setCoupon] = useState(true);
  const [toast, setToast] = useState("");
  const [favs, setFavs] = useState<number[]>([1,3]);
  const [bookings, setBookings] = useState<Booking[]>([
    { id:"BB-2841", partner:"SmartWash Laundry", service:"Wash & Fold • 4 kg", qty:4, price:180, status:"In Process", date:"Today, 12 May", slot:"Pickup 4:00 PM", img:PARTNERS[2].img },
    { id:"BB-2790", partner:"FreshWash Laundry", service:"Dry Cleaning • 2 pcs", qty:2, price:320, status:"Ready", date:"Yesterday", slot:"Delivered 7:30 PM", img:PARTNERS[0].img },
  ]);
  const [kg, setKg] = useState(4);
  const [calcService, setCalcService] = useState("Wash & Fold");
  const [express, setExpress] = useState(false);
  const [faq, setFaq] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [trackStep, setTrackStep] = useState(1);

  useEffect(()=>{ const t=setInterval(()=>setWordIdx(v=>(v+1)%ROTATING.length),2200); return ()=>clearInterval(t); },[]);
  const showToast=(m:string)=>{ setToast(m); setTimeout(()=>setToast(""),3200); };
  const toggleFav=(id:number)=>setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);
  const toggleCompare=(id:number)=>setCompare(c=>c.includes(id)?c.filter(x=>x!==id):c.length>=3?[...c.slice(1),id]:[...c,id]);

  const filtered = useMemo(()=>{
    let list = PARTNERS.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.area.toLowerCase().includes(search.toLowerCase()));
    if(sort==="cheap") list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="rating") list=[...list].sort((a,b)=>b.rating-a.rating);
    if(sort==="nearest") list=[...list].sort((a,b)=>parseFloat(a.distance)-parseFloat(b.distance));
    return list;
  },[search,sort]);

  const calcPrice = useMemo(()=>{
    const result = estimateLaundry(samplePartners, calcService, kg, express)!;
    const best = PARTNERS.find(p => p.name === result.partner.name)!;
    return { base: result.rate, unit: result.unit, total: result.total, best };
  },[kg,calcService,express]);

  const totalPrice = selected ? Math.round(priceFor(selected, service)*qty*(coupon?0.9:1)) : 0;
  const confirmBooking=()=>{ setSelected(null); showToast("Preview only — live booking and payments are not connected."); };
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  /* ================= UNIQUE HOMEPAGE ================= */
  return (
    <div className="min-h-screen bg-[#F2F8FF] overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-3 inset-x-3 sm:inset-x-4 z-50 max-w-7xl mx-auto">
        <div className="glass rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-white/70 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">
          <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className="flex items-center gap-2.5 shrink-0"><img src="/images/logo.webp" alt="BB LaundryLink" className="preserved-brand"/></button>
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 rounded-full p-1 border border-slate-100">
            {[["Home","hero"],["Find Laundry","partners"],["How It Works","how"],["Pricing","calculator"],["Reviews","reviews"],["FAQ","faq"]].map((l,i)=>(
              <button key={l[0]} onClick={()=>scrollTo(l[1])} className={`px-3.5 py-2 rounded-full text-[13px] font-bold ${i===0?"bg-slate-900 text-white":"text-slate-600 hover:text-slate-900"}`}>{l[0]}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 hidden sm:flex items-center justify-center"><Bell className="w-5 h-5"/><span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">2</span></button>
            <button onClick={()=>navigate("/login")} className="hidden sm:block text-xs font-black border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition">Login</button>
            <button onClick={()=>navigate("/register")} className="bg-orange-500 text-white text-xs font-black px-4 py-2.5 rounded-full shadow-lg shadow-orange-500/30 hover:scale-[1.03] transition">Register</button>
            <button aria-label="Toggle navigation" aria-expanded={mobileMenu} onClick={()=>setMobileMenu(!mobileMenu)} className="lg:hidden w-10 h-10 rounded-full bg-white border flex items-center justify-center"><Menu className="w-5 h-5"/></button>
          </div>
        </div>
        <AnimatePresence>{mobileMenu&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="lg:hidden mt-2 glass rounded-3xl border p-3 shadow-xl">{[["Home","hero"],["Find Laundry","partners"],["How It Works","how"],["Pricing","calculator"],["Reviews","reviews"],["FAQ","faq"]].map(l=>(<button key={l[0]} onClick={()=>{scrollTo(l[1]); setMobileMenu(false);}} className="w-full text-left px-4 py-3 rounded-2xl font-bold hover:bg-blue-50">{l[0]}</button>))}<button onClick={()=>setMode("dashboard")} className="w-full bg-blue-600 text-white font-black py-3 rounded-2xl mt-2">Go to Dashboard →</button></motion.div>}</AnimatePresence>
      </header>

      {/* HERO — UNIQUE circular + rotating word */}
      <section id="hero" className="relative mesh pt-[120px] sm:pt-[132px] pb-10 px-3 sm:px-4">
        <div className="absolute top-24 left-[8%] w-12 h-12 rounded-full border-2 border-sky-300 animate-bubble hidden md:block"/>
        <div className="absolute top-40 right-[12%] w-6 h-6 rounded-full bg-orange-300 animate-bubble hidden md:block" style={{animationDelay:".8s"}}/>
        <div className="absolute bottom-20 left-[45%] w-8 h-8 rounded-full border-2 border-blue-200 animate-bubble hidden lg:block" style={{animationDelay:"1.4s"}}/>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 relative z-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-white border border-blue-100 shadow-sm text-blue-700 text-[11px] font-black px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5"/> Smart City Bhubaneswar</span>
              <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-black px-3 py-1.5 rounded-full"><Sparkles className="w-3.5 h-3.5 text-amber-400"/> 12,000+ Happy Users</span>
            </div>
            <h1 className="font-display font-black text-[42px] sm:text-[64px] lg:text-[72px] leading-[0.92] tracking-tight">
              Laundry,<br/>but make it<br/>
              <span className="relative inline-block text-gradient-blue">
                <AnimatePresence mode="wait"><motion.span key={wordIdx} initial={{y:18,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-18,opacity:0}} transition={{duration:.35}} className="inline-block">{ROTATING[wordIdx]}</motion.span></AnimatePresence>
              </span>
            </h1>
            <p className="mt-4 text-slate-600 font-medium text-base sm:text-lg max-w-lg leading-relaxed">Discover the best laundry near you with <b className="text-slate-900">transparent prices</b> and trusted partners. Find. Compare. Book — in just a few clicks.</p>

            {/* Search */}
            <div className="mt-6 bg-white rounded-[28px] sm:rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.18)] border border-blue-50 p-2 flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="flex items-center gap-2 flex-1 px-3 py-1">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0"/>
                <select value={area} onChange={e=>setArea(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-slate-800 py-2">
                  <option>Bhubaneswar</option><option>Patia</option><option>Saheed Nagar</option><option>Kharavela Nagar</option><option>IRC Village</option><option>Cuttack</option>
                </select>
              </div>
              <div className="hidden sm:block w-px bg-slate-200 my-2"/>
              <div className="flex items-center gap-2 flex-[1.3] px-3 bg-slate-50 sm:bg-transparent rounded-full py-2 sm:py-0 border sm:border-0">
                <Search className="w-5 h-5 text-slate-400 shrink-0"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search FreshWash, SmartWash..." className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-slate-400"/>
              </div>
              <button onClick={()=>scrollTo("partners")} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition"><Search className="w-4 h-4"/> Search</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">{["Patia","Saheed Nagar","IRC Village","Khandagiri"].map(a=>(<button key={a} onClick={()=>{setArea(a); setSearch(a); scrollTo("partners");}} className="text-[11px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition">📍 {a}</button>))}</div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {[{i:Zap,t:"Quick Booking",s:"30 seconds"},{i:ShieldCheck,t:"Trusted Partners",s:"Verified shops"},{i:BadgePercent,t:"Best Prices",s:"Compare & save"},{i:Star,t:"Top Rated",s:"4.8★ average"}].map((x,i)=>(
                <div key={i} className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-white shadow-sm border flex items-center justify-center text-blue-600"><x.i className="w-5 h-5"/></span><div className="leading-tight"><p className="text-xs font-black">{x.t}</p><p className="text-[11px] font-bold text-slate-500">{x.s}</p></div></div>
              ))}
            </div>
          </div>

          {/* Circular hero */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px]">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-300/50 to-orange-200/50 animate-blob"/>
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
                <defs><path id="circ" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"/></defs>
                <text className="fill-slate-800" style={{fontSize:"10.5px",fontWeight:800,letterSpacing:"3px"}}><textPath href="#circ">FRESH • CLEAN • ON TIME • BB LAUNDRYLINK • FRESH • CLEAN •</textPath></text>
              </svg>
              <div className="absolute inset-6 rounded-full overflow-hidden border-[6px] border-white shadow-2xl">
                <img src="/images/landing-fresh.webp" className="w-full h-full object-cover" alt="Happy customer with fresh laundry"/>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"/>
              </div>
              <div className="absolute -left-2 sm:-left-8 top-10 glass rounded-2xl shadow-xl px-3.5 py-3 animate-floaty flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><Star className="w-5 h-5 fill-white"/></span>
                <div className="leading-tight"><p className="text-sm font-black">4.8 Rating</p><p className="text-[11px] font-bold text-slate-500">2,100+ reviews</p></div>
              </div>
              <div className="absolute -right-2 sm:-right-6 bottom-16 glass rounded-2xl shadow-xl px-3.5 py-3 animate-floaty flex items-center gap-2.5" style={{animationDelay:".7s"}}>
                <span className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center"><Bike className="w-5 h-5"/></span>
                <div className="leading-tight"><p className="text-sm font-black">Pickup in 30 min</p><p className="text-[11px] font-bold text-slate-500">Free delivery</p></div>
              </div>
              <div className="absolute left-4 -bottom-2 bg-slate-900 text-white rounded-2xl shadow-xl px-4 py-3 animate-floaty" style={{animationDelay:"1.2s"}}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Laundry,</p><p className="font-display font-black">Our Priority! ❤️</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-slate-900 py-3 overflow-hidden -rotate-1 scale-[1.02] my-2">
        <div className="flex whitespace-nowrap animate-marquee gap-10 text-white text-xs font-black tracking-widest">
          {Array(2).fill(["100% SECURE & TRUSTED","24/7 SUPPORT","FREE PICKUP IN BHUBANESWAR","FRESH CLOTHES, HAPPIER YOU","120+ VERIFIED PARTNERS","EXPRESS 30 MIN DELIVERY"]).flat().map((t,i)=>(<span key={i} className="flex items-center gap-3">✦ {t}</span>))}
        </div>
      </div>

      {/* SERVICES — EXPANDABLE (UNIQUE) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-12">
        <div className="flex items-end justify-between mb-4 px-1">
          <div><p className="text-xs font-black tracking-widest text-blue-600 uppercase">Our Services</p><h2 className="font-display font-black text-2xl sm:text-3xl mt-1">Hover to explore <span className="text-gradient-orange">services</span></h2></div>
          <p className="hidden sm:block text-xs font-bold text-slate-500">Move your mouse over a card →</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:h-[380px]">
          {SERVICES.map(s=>(
            <div key={s.id} className="group relative flex-1 hover:flex-[2.4] transition-all duration-500 rounded-[28px] overflow-hidden min-h-[180px] md:min-h-0 cursor-pointer shadow-lg" onClick={()=>{setCalcService(s.label==="Shoe & Premium"?"Shoe Care":s.label); scrollTo("calculator");}}>
              <img src={s.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={s.label}/>
              <div className={`absolute inset-0 bg-gradient-to-t ${s.grad}/90 via-slate-900/30 to-transparent`}/>
              <div className="relative h-full flex flex-col justify-between p-5 text-white">
                <div className="flex justify-between items-start"><span className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"><s.icon className="w-6 h-6"/></span><span className="bg-white text-slate-900 text-xs font-black px-2.5 py-1 rounded-full">{s.price}</span></div>
                <div>
                  <p className="font-display font-black text-xl leading-tight">{s.label}</p>
                  <p className="text-xs font-semibold text-white/85 mt-1.5 leading-relaxed opacity-0 group-hover:opacity-100 transition duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">{s.desc}</p>
                  <p className="mt-3 text-[11px] font-black flex items-center gap-1">Calculate Price <ArrowUpRight className="w-3.5 h-3.5"/></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICE CALCULATOR — UNIQUE */}
      <section id="calculator" className="max-w-7xl mx-auto px-3 sm:px-4 mt-14 scroll-mt-28">
        <div className="bg-slate-900 rounded-[36px] overflow-hidden grid lg:grid-cols-12 shadow-2xl">
          <div className="lg:col-span-7 p-6 sm:p-10 text-white">
            <p className="text-xs font-black tracking-widest text-sky-400 uppercase flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Live Price Calculator</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl mt-2 leading-tight">Know your price<br/><span className="text-gradient-orange">before you book.</span></h2>
            <p className="text-slate-400 font-medium text-sm mt-3 max-w-md">No hidden charges. Drag the slider, pick a service — we instantly show the best price near you.</p>
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3"><label className="text-sm font-black">How many {calcPrice.unit}?</label><span className="bg-white text-slate-900 font-display font-black text-xl px-4 py-1.5 rounded-full">{kg} {calcPrice.unit}</span></div>
              <input type="range" min={1} max={15} value={kg} onChange={e=>setKg(Number(e.target.value))} className="w-full"/>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2"><span>1</span><span>15</span></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">{["Wash & Fold","Ironing","Dry Cleaning","Shoe Care"].map(s=>(
              <button key={s} onClick={()=>setCalcService(s)} className={`px-4 py-2.5 rounded-full text-xs font-black border-2 transition ${calcService===s?"bg-white text-slate-900 border-white":"border-white/20 text-white hover:border-white/50"}`}>{s} • {s==="Wash & Fold"?"₹45":s==="Ironing"?"₹20":s==="Dry Cleaning"?"₹100":"₹149"}</button>
            ))}</div>
            <label className="mt-5 flex items-center justify-between bg-white/10 border border-white/15 rounded-2xl p-4 cursor-pointer">
              <span className="text-sm font-black flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400"/> Express Delivery (+30%) <span className="text-slate-400 font-bold text-xs">Same day</span></span>
              <input type="checkbox" checked={express} onChange={e=>setExpress(e.target.checked)} className="w-5 h-5 accent-amber-400"/>
            </label>
          </div>
          <div className="lg:col-span-5 bg-white p-6 sm:p-10 flex flex-col justify-center">
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Estimated Total</p>
            <p className="font-display font-black text-6xl mt-2">₹{calcPrice.total}</p>
            <p className="text-sm font-bold text-slate-500 mt-1">{calcService} • {kg} {calcPrice.unit} {express?"• Express":""} • Pickup FREE</p>
            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
              <img src={calcPrice.best.img} className="w-14 h-14 rounded-xl object-cover" alt=""/>
              <div className="flex-1"><p className="text-[10px] font-black tracking-wider text-blue-600 uppercase">Best Price Near You</p><p className="font-black text-sm">{calcPrice.best.name} • ₹{calcPrice.base}/{calcPrice.unit}</p><p className="text-xs font-bold text-slate-500">{calcPrice.best.area} • {calcPrice.best.distance}</p></div>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400"/>
            </div>
            <button onClick={()=>{setSelected(calcPrice.best); setQty(kg); setService(calcService);}} className="mt-5 w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black py-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] transition">Book at ₹{calcPrice.total} <ArrowRight className="w-4 h-4"/></button>
            <p className="text-center text-[11px] font-bold text-slate-400 mt-3 flex items-center justify-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Free cancellation • Pay via Wallet / UPI / Cash</p>
          </div>
        </div>
      </section>

      {/* PARTNERS + COMPARE — UNIQUE */}
      <section id="partners" className="max-w-7xl mx-auto px-3 sm:px-4 mt-14 scroll-mt-28">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5 px-1">
          <div><p className="text-xs font-black tracking-widest text-blue-600 uppercase">Find • Compare • Book</p><h2 className="font-display font-black text-2xl sm:text-3xl mt-1">Nearby Laundry Partners</h2><p className="text-sm font-semibold text-slate-500 mt-1">Tick <b>Compare</b> on 2–3 shops to see price, rating & distance side-by-side.</p></div>
          <div className="flex gap-2">
            <div className="relative"><select value={sort} onChange={e=>setSort(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-full pl-4 pr-9 py-2.5 text-xs font-black outline-none shadow-sm"><option value="nearest">Sort: Nearest</option><option value="cheap">Sort: Cheapest</option><option value="rating">Sort: Top Rated</option></select><ChevronDown className="w-4 h-4 absolute right-3 top-3 pointer-events-none text-slate-500"/></div>
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-2.5 rounded-full"><MapPin className="w-3.5 h-3.5"/> {area}</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p,idx)=>(
            <motion.article key={p.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:idx*0.06}} className="group bg-white rounded-[28px] overflow-hidden border border-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_50px_rgba(15,23,42,0.14)] hover:-translate-y-1.5 transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.name}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                <span className="absolute top-3 left-3 bg-white text-slate-900 text-[11px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow"><Star className="w-3 h-3 fill-emerald-500 text-emerald-500"/> {p.rating} <span className="text-slate-400">({p.reviews})</span></span>
                <button aria-label={`Favorite ${p.name}`} aria-pressed={favs.includes(p.id)} onClick={()=>toggleFav(p.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:scale-110 transition"><Heart className={`w-4 h-4 ${favs.includes(p.id)?"fill-red-500 text-red-500":"text-slate-600"}`}/></button>
                <span className={`absolute bottom-3 left-3 bg-gradient-to-r ${p.color} text-white text-[10px] font-black px-2.5 py-1 rounded-full`}>{p.tag}</span>
              </div>
              <div className="p-4">
                <div className="flex justify-between gap-2"><h3 className="font-black leading-tight">{p.name}</h3><div className="text-right shrink-0"><p className="font-black text-blue-600">₹{p.price}<span className="text-[11px] text-slate-400">/kg</span></p><p className="text-[11px] text-slate-400 line-through font-bold">₹{p.mrp}/kg</p></div></div>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-blue-500"/> {p.area}</p>
                <div className="flex gap-3 mt-2 text-[11px] font-bold text-slate-600"><span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5"/> {p.distance}</span><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {p.time}</span><span className="text-orange-600 font-black">{p.offer}</span></div>
                <div className="flex gap-2 mt-4">
                  <button onClick={()=>{setService(p.services[0]); setSelected(p);}} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black py-3 rounded-full transition flex items-center justify-center gap-1.5">Book Now <ArrowRight className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>toggleCompare(p.id)} className={`px-3.5 py-3 rounded-full text-xs font-black border-2 flex items-center gap-1.5 transition ${compare.includes(p.id)?"bg-blue-600 text-white border-blue-600":"bg-white border-slate-200 text-slate-700"}`}><Scale className="w-3.5 h-3.5"/> {compare.includes(p.id)?"Added":"Compare"}</button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        {filtered.length===0&&<div className="text-center py-14 bg-white rounded-[28px] mt-4"><p className="font-black">No partners found for “{search}”</p><button onClick={()=>setSearch("")} className="mt-3 bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full">Clear Search</button></div>}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-3 sm:px-4 mt-14 scroll-mt-28">
        <div className="grid lg:grid-cols-12 gap-6 items-center bg-white rounded-[36px] border border-white shadow-sm p-6 sm:p-10 overflow-hidden relative">
          <div className="lg:col-span-5 relative">
            <div className="rounded-[28px] overflow-hidden h-[360px]"><img src="/images/landing-fresh.webp" className="w-full h-full object-cover" alt=""/></div>
            <div className="absolute -bottom-4 left-6 bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"><Play className="w-8 h-8 fill-white"/><div><p className="text-xs font-bold text-slate-400">Watch how it works</p><p className="font-black text-sm">2 min video</p></div></div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs font-black tracking-widest text-blue-600 uppercase">How It Works</p>
            <h2 className="font-display font-black text-3xl mt-2">Fresh clothes in <span className="text-gradient-orange">3 simple steps</span></h2>
            <div className="mt-8 space-y-5">
              {[{n:"01",t:"Book in 30 Seconds",d:"Pick a partner, choose service & slot. Pay via Wallet, UPI or Cash — your choice.",i:CalendarClock},{n:"02",t:"We Pickup at Your Doorstep",d:"Our partner arrives in 30 mins, picks up your clothes. You get live pickup confirmation.",i:Bike},{n:"03",t:"Fresh Delivery in 24 Hours",d:"Washed, ironed & packed fresh. Delivered to your door — track every step live.",i:Package}].map((s,i)=>(
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center"><span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition"><s.i className="w-6 h-6"/></span>{i<2&&<span className="w-0.5 flex-1 bg-gradient-to-b from-blue-200 to-transparent mt-2"/>}</div>
                  <div className="pb-2"><p className="text-[11px] font-black text-blue-600 tracking-widest">STEP {s.n}</p><p className="font-black text-lg">{s.t}</p><p className="text-sm font-medium text-slate-500 leading-relaxed">{s.d}</p></div>
                </div>
              ))}
            </div>
            <button onClick={()=>scrollTo("partners")} className="mt-4 bg-slate-900 text-white font-black px-6 py-3.5 rounded-full text-sm flex items-center gap-2 hover:bg-blue-600 transition">Start Booking <ArrowRight className="w-4 h-4"/></button>
          </div>
        </div>
      </section>

      {/* BENTO STATS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{v:"120+",l:"Verified Partners",i:Store,c:"bg-blue-600"},{v:"12k+",l:"Happy Customers",i:Users,c:"bg-orange-500"},{v:"4.8★",l:"Average Rating",i:Award,c:"bg-emerald-500"},{v:"30 min",l:"Avg. Pickup Time",i:Timer,c:"bg-violet-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-[24px] border border-white shadow-sm p-5 flex items-center gap-4 hover:-translate-y-1 transition"><span className={`w-12 h-12 rounded-2xl ${s.c} text-white flex items-center justify-center shrink-0`}><s.i className="w-6 h-6"/></span><div><p className="font-display font-black text-2xl leading-none">{s.v}</p><p className="text-xs font-bold text-slate-500 mt-1">{s.l}</p></div></div>
        ))}
      </section>

      {/* TESTIMONIALS MARQUEE */}
      <section id="reviews" className="mt-14 scroll-mt-28">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-center px-4">Loved across <span className="text-gradient-blue">Bhubaneswar</span> ❤️</h2>
        <div className="mt-6 space-y-4 overflow-hidden">
          <div className="flex gap-4 animate-marquee w-max">{[...TESTIMONIALS,...TESTIMONIALS].map((t,i)=>(
            <div key={i} className="w-[320px] shrink-0 bg-white rounded-[24px] border border-white shadow-sm p-5"><Quote className="w-6 h-6 text-blue-200 fill-blue-200"/><p className="text-sm font-medium text-slate-700 leading-relaxed mt-2">“{t.text}”</p><div className="flex items-center gap-3 mt-4"><img src={t.img} className="w-10 h-10 rounded-full object-cover" alt=""/><div><p className="font-black text-sm">{t.name}</p><p className="text-xs font-bold text-slate-500">{t.area} • {"★".repeat(t.stars)}</p></div></div></div>
          ))}</div>
          <div className="flex gap-4 animate-marquee-rev w-max">{[...TESTIMONIALS].reverse().concat([...TESTIMONIALS].reverse()).map((t,i)=>(
            <div key={i} className="w-[320px] shrink-0 bg-slate-900 text-white rounded-[24px] p-5"><Quote className="w-6 h-6 text-white/20 fill-white/20"/><p className="text-sm font-medium text-slate-200 leading-relaxed mt-2">“{t.text}”</p><div className="flex items-center gap-3 mt-4"><img src={t.img} className="w-10 h-10 rounded-full object-cover" alt=""/><div><p className="font-black text-sm">{t.name}</p><p className="text-xs font-bold text-slate-400">{t.area} • {"★".repeat(t.stars)}</p></div></div></div>
          ))}</div>
        </div>
      </section>

      {/* APP DOWNLOAD — PHONE MOCKUP */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-14">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 rounded-[36px] overflow-hidden grid lg:grid-cols-12 items-center shadow-2xl">
          <div className="lg:col-span-7 p-8 sm:p-12 text-white">
            <p className="text-xs font-black tracking-widest text-sky-200 uppercase">BB LaundryLink App</p>
            <h2 className="font-display font-black text-3xl sm:text-5xl leading-tight mt-2">Book Laundry<br/>in Just a Few Clicks!</h2>
            <div className="mt-6 space-y-3">{["Find Nearby Shops instantly","Compare Prices transparently","Track Your Order live"].map((t,i)=>(
              <p key={i} className="flex items-center gap-3 font-bold"><span className="w-7 h-7 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center shrink-0"><Check className="w-4 h-4"/></span> {t}</p>
            ))}</div>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={()=>showToast("The mobile app is not published yet.")} className="bg-white text-slate-900 font-black px-5 py-3 rounded-2xl flex items-center gap-2 text-sm"><Download className="w-4 h-4"/> Google Play</button>
              <button onClick={()=>showToast("The mobile app is not published yet.")} className="bg-slate-900 text-white font-black px-5 py-3 rounded-2xl flex items-center gap-2 text-sm"><Smartphone className="w-4 h-4"/> App Store</button>
            </div>
            <button onClick={()=>scrollTo("partners")} className="mt-5 bg-orange-500 text-white font-black px-6 py-3.5 rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/40">Start Booking <ArrowRight className="w-4 h-4"/></button>
          </div>
          <div className="lg:col-span-5 flex justify-center py-8 lg:py-12">
            <div className="relative w-[220px] h-[440px] bg-slate-900 rounded-[36px] p-2.5 shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
              <div className="bg-white rounded-[28px] overflow-hidden h-full flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-4"><p className="text-[10px] font-bold opacity-80">Welcome back</p><p className="font-display font-black">Ritika Swain</p><div className="mt-2 bg-white/20 rounded-full px-3 py-1.5 text-[11px] font-bold flex items-center gap-1"><MapPin className="w-3 h-3"/> Bhubaneswar</div></div>
                <div className="p-3 space-y-2.5 flex-1">
                  {PARTNERS.slice(0,3).map(p=>(<div key={p.id} className="flex gap-2.5 items-center bg-slate-50 rounded-2xl p-2"><img src={p.img} className="w-11 h-11 rounded-xl object-cover" alt=""/><div className="flex-1 min-w-0"><p className="text-[11px] font-black truncate">{p.name}</p><p className="text-[10px] font-bold text-slate-500">₹{p.price}/kg • {p.distance}</p></div><span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded-full">Book</span></div>))}
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center"><p className="text-[11px] font-black text-orange-600">10% OFF • WELCOME10</p></div>
                </div>
                <div className="p-3 border-t flex justify-around text-slate-400"><Home className="w-5 h-5 text-blue-600"/><CalendarDays className="w-5 h-5"/><Truck className="w-5 h-5"/><User className="w-5 h-5"/></div>
              </div>
              <span className="absolute -left-3 top-16 bg-white shadow-xl rounded-full px-2.5 py-1 text-[10px] font-black flex items-center gap-1 animate-floaty"><MapPin className="w-3 h-3 text-red-500"/> Patia</span>
              <span className="absolute -right-3 bottom-24 bg-white shadow-xl rounded-full px-2.5 py-1 text-[10px] font-black flex items-center gap-1 animate-floaty" style={{animationDelay:".6s"}}><MapPin className="w-3 h-3 text-blue-600"/> IRC Village</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-3 sm:px-4 mt-14 scroll-mt-28">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-center">Frequently Asked <span className="text-gradient-blue">Questions</span></h2>
        <div className="mt-6 space-y-3">{FAQS.map((f,i)=>(
          <div key={i} className="bg-white rounded-[24px] border border-white shadow-sm overflow-hidden">
            <button aria-expanded={faq===i} onClick={()=>setFaq(faq===i?-1:i)} className="w-full flex items-center justify-between gap-3 p-5 text-left"><span className="font-black text-sm sm:text-base">{f.q}</span><span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${faq===i?"bg-blue-600 text-white rotate-180":"bg-slate-100"}`}><ChevronUp className="w-4 h-4"/></span></button>
            <AnimatePresence>{faq===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}><p className="px-5 pb-5 text-sm font-medium text-slate-600 leading-relaxed">{f.a}</p></motion.div>}</AnimatePresence>
          </div>
        ))}</div>
      </section>

      {/* CTA + FOOTER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mt-14">
        <div className="bg-slate-900 rounded-[36px] p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"/>
          <p className="relative font-display font-black text-3xl sm:text-5xl leading-tight">Your Laundry,<br/><span className="text-gradient-orange">Our Priority!</span></p>
          <p className="relative text-slate-400 font-medium mt-3 max-w-md mx-auto">Join 12,000+ happy customers in Bhubaneswar. Fresh clothes, happier you.</p>
          <div className="relative flex flex-wrap justify-center gap-3 mt-7">
            <button onClick={()=>scrollTo("partners")} className="bg-orange-500 text-white font-black px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/40">Find Laundry Near Me →</button>
            <button onClick={()=>setMode("dashboard")} className="bg-white text-slate-900 font-black px-7 py-3.5 rounded-full">Go to Dashboard</button>
          </div>
        </div>
      </section>

      <footer className="mt-10 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[{i:Headphones,t:"24/7 Support",s:"We're always here to help"},{i:ShieldCheck,t:"Secure & Reliable",s:"Your trust, our priority"},{i:Users,t:"Trusted Community",s:"Thousands of happy users"},{i:TrendingUp,t:"Grow Together",s:"For a cleaner, fresher city"}].map((x,i)=>(
              <div key={i} className="flex items-center gap-3"><span className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><x.i className="w-6 h-6"/></span><div><p className="font-black text-sm">{x.t}</p><p className="text-xs font-semibold text-slate-500">{x.s}</p></div></div>
            ))}
          </div>
          <p className="font-display font-black text-[13vw] lg:text-[110px] leading-none text-center tracking-tight text-slate-100 select-none">BB LaundryLink</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500">© 2026 BB LaundryLink • Find. Compare. Book. • Made with ❤️ in Bhubaneswar</p>
            <div className="flex gap-4 text-xs font-black text-slate-600">{["Privacy","Terms","Contact","Partner With Us"].map(l=>(<button key={l} onClick={()=>showToast(l+" page coming soon")} className="hover:text-blue-600">{l}</button>))}</div>
          </div>
        </div>
      </footer>

      {/* COMPARE BAR */}
      <AnimatePresence>{compare.length>=2&&(
        <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}} className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 sm:w-auto">
          <div className="glass-dark text-white rounded-full shadow-2xl px-4 py-3 flex items-center gap-3 max-w-full">
            <span className="text-xs font-black whitespace-nowrap">{compare.length} selected</span>
            <div className="flex -space-x-2">{compare.map(id=>{const p=PARTNERS.find(x=>x.id===id); return p?<img key={id} src={p.img} className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover" alt=""/>:null;})}</div>
            <button onClick={()=>setCompareOpen(true)} className="bg-orange-500 text-white text-xs font-black px-4 py-2.5 rounded-full whitespace-nowrap">Compare Now →</button>
            <button aria-label="Clear comparison" onClick={()=>setCompare([])} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><X className="w-4 h-4"/></button>
          </div>
        </motion.div>)}
      </AnimatePresence>

      {/* COMPARE MODAL */}
      <AnimatePresence>{compareOpen&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3" onClick={()=>setCompareOpen(false)}>
          <motion.div role="dialog" aria-modal="true" aria-label="Partner preview" tabIndex={-1} data-design-dialog="true" initial={{y:40}} animate={{y:0}} onClick={e=>e.stopPropagation()} className="bg-white w-full max-w-3xl rounded-[28px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b"><h3 className="font-display font-black text-xl flex items-center gap-2"><Scale className="w-5 h-5 text-blue-600"/> Compare Partners</h3><button aria-label="Close comparison" onClick={()=>setCompareOpen(false)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"><X className="w-5 h-5"/></button></div>
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-[560px]">
              <thead><tr className="bg-slate-50"><th className="text-left p-4 font-black text-slate-500 text-xs uppercase">Feature</th>{compare.map(id=>{const p=PARTNERS.find(x=>x.id===id); return p?<th key={id} className="p-3 text-left"><img src={p.img} className="w-full h-24 object-cover rounded-2xl mb-2" alt=""/><p className="font-black text-sm">{p.name}</p><p className="text-xs font-bold text-slate-500">{p.area}</p></th>:null;})}</tr></thead>
              <tbody>
                {[["Price per kg",compare.map(id=>`₹${PARTNERS.find(x=>x.id===id)?.price}`)],["Rating",compare.map(id=>`★ ${PARTNERS.find(x=>x.id===id)?.rating}`)],["Distance",compare.map(id=>PARTNERS.find(x=>x.id===id)?.distance||"")],["Delivery Time",compare.map(id=>PARTNERS.find(x=>x.id===id)?.time||"")],["Offer",compare.map(id=>PARTNERS.find(x=>x.id===id)?.offer||"")]].map((row,i)=>(
                  <tr key={i} className="border-t border-slate-100"><td className="p-4 font-black text-slate-500 text-xs uppercase">{row[0]}</td>{(row[1] as string[]).map((v,j)=>(<td key={j} className={`p-4 font-black ${i===0&&v===`₹${Math.min(...compare.map(id=>PARTNERS.find(x=>x.id===id)?.price||999))}`?"text-emerald-600":""}`}>{v}{i===0&&v===`₹${Math.min(...compare.map(id=>PARTNERS.find(x=>x.id===id)?.price||999))}`?" 🏆 Best":""}</td>))}</tr>
                ))}
                <tr className="border-t"><td className="p-4"></td>{compare.map(id=>{const p=PARTNERS.find(x=>x.id===id); return p?<td key={id} className="p-3"><button onClick={()=>{setCompareOpen(false); setService(p.services[0]); setSelected(p);}} className="w-full bg-slate-900 text-white text-xs font-black py-3 rounded-full">Book Now</button></td>:null;})}</tr>
              </tbody>
            </table></div>
          </motion.div>
        </motion.div>)}
      </AnimatePresence>

      <BookingModal selected={selected} setSelected={setSelected} qty={qty} setQty={setQty} service={service} setService={setService} slot={slot} setSlot={setSlot} coupon={coupon} setCoupon={setCoupon} totalPrice={totalPrice} confirmBooking={confirmBooking}/>
      <Toast toast={toast}/>
    </div>
  );
}

function BookingModal({selected,setSelected,qty,setQty,service,setService,slot,setSlot,coupon,setCoupon,totalPrice,confirmBooking}:any){
  if(!selected) return null;
  return (
    <AnimatePresence>{selected&&(
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3" onClick={()=>setSelected(null)}>
        <motion.div role="dialog" aria-modal="true" aria-label="Partner preview" tabIndex={-1} data-design-dialog="true" initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} exit={{y:40,opacity:0}} onClick={(e:any)=>e.stopPropagation()} className="bg-white w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto">
          <div className="relative h-44"><img src={selected.img} className="w-full h-full object-cover" alt=""/><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/><button aria-label="Close booking preview" onClick={()=>setSelected(null)} className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow"><X className="w-5 h-5"/></button><div className="absolute bottom-4 left-5 right-5 text-white"><p className="font-display font-black text-xl">{selected.name}</p><p className="text-xs font-bold text-white/80 flex items-center gap-2 mt-1"><span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/> {selected.rating}</span> • {selected.area} • {selected.distance}</p></div></div>
          <div className="p-5 space-y-4">
            <div><p className="text-xs font-black tracking-wider text-slate-400 uppercase mb-2">Select Service</p><div className="flex flex-wrap gap-2">{selected.services.map((s:string)=>(<button key={s} onClick={()=>setService(s)} className={`px-4 py-2.5 rounded-full text-xs font-black border-2 ${service===s?"bg-slate-900 text-white border-slate-900":"bg-white border-slate-200"}`}>{s}</button>))}</div></div>
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3"><div><p className="text-xs font-black tracking-wider text-slate-400 uppercase">Quantity</p><p className="font-black text-sm">{service==="Ironing"?"Pieces":"Kilograms"}</p></div><div className="flex items-center gap-3"><button onClick={()=>setQty(Math.max(1,qty-1))} className="w-9 h-9 rounded-full bg-white border flex items-center justify-center"><Minus className="w-4 h-4"/></button><span className="font-display font-black text-xl w-8 text-center">{qty}</span><button onClick={()=>setQty(qty+1)} className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center"><Plus className="w-4 h-4"/></button></div></div>
            <div><p className="text-xs font-black tracking-wider text-slate-400 uppercase mb-2">Pickup Slot</p><div className="grid grid-cols-3 gap-2">{["Today • 2 PM","Today • 4 PM","Today • 6 PM","Tomorrow • 9 AM","Tomorrow • 12 PM","Tomorrow • 4 PM"].map((s:string)=>(<button key={s} onClick={()=>setSlot(s)} className={`py-2.5 rounded-xl text-[11px] font-black border-2 ${slot===s?"bg-blue-600 text-white border-blue-600":"bg-white border-slate-200"}`}>{s}</button>))}</div></div>
            <label className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-2xl p-3 cursor-pointer"><span className="text-sm font-black flex items-center gap-2"><Gift className="w-4 h-4 text-orange-500"/> Apply WELCOME10 (10% OFF)</span><input type="checkbox" checked={coupon} onChange={(e:any)=>setCoupon(e.target.checked)} className="w-5 h-5 accent-orange-500"/></label>
            <div className="border-t pt-3 space-y-1.5 text-sm font-bold text-slate-600"><div className="flex justify-between"><span>{service} × {qty}</span><span>₹{priceFor(selected, service)*qty}</span></div>{coupon&&<div className="flex justify-between text-emerald-600"><span>Discount (10%)</span><span>-₹{Math.round(priceFor(selected, service)*qty*0.1)}</span></div>}<div className="flex justify-between"><span>Pickup & Delivery</span><span className="text-emerald-600">FREE</span></div><div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t"><span>Sample total</span><span>₹{totalPrice}</span></div></div>
            <button onClick={confirmBooking} className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black py-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">Preview Booking • ₹{totalPrice} <ArrowRight className="w-4 h-4"/></button>
            <p className="text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> 100% Secure • Free cancellation till pickup</p>
          </div>
        </motion.div>
      </motion.div>)}
    </AnimatePresence>
  );
}
function Toast({toast}:any){
  return <AnimatePresence>{toast&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap max-w-[92vw] overflow-hidden text-ellipsis"><CircleCheck className="w-4 h-4 text-emerald-400 shrink-0"/> {toast}</motion.div>}</AnimatePresence>;
}
