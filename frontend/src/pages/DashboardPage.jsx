import { useState } from 'react'
import { sortPartners } from '../utils/sortPartners'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { api } from '../services/api'
import './DashboardPage.css'

const shops = [
  { id: 'freshwash', name: 'FreshWash Laundry', area: 'Patia, Bhubaneswar', price: 50, rating: 4.7, distance: '1.2', time: 30, services: ['Wash & Fold', 'Ironing', 'Pickup & Delivery'] },
  { id: 'cleancare', name: 'CleanCare Laundry', area: 'Kharavela Nagar', price: 60, rating: 4.6, distance: '2.1', time: 40, services: ['Wash & Fold', 'Dry Cleaning', 'Pickup & Delivery'] },
  { id: 'smartwash', name: 'SmartWash Laundry', area: 'IRC Village', price: 45, rating: 4.8, distance: '3.0', time: 50, services: ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Pickup & Delivery'] },
]
const navigation = [['home', 'Dashboard'], ['calendar', 'My Bookings'], ['pin', 'Track Order'], ['wallet', 'My Wallet'], ['gift', 'Offers & Deals'], ['user', 'My Profile'], ['support', 'Support']]
const categories = [['wash', 'Wash & Fold', 'Save Time'], ['hanger', 'Dry Cleaning', 'Premium Care'], ['iron', 'Ironing', 'Perfect Finish'], ['truck', 'Pickup & Delivery', 'At Your Doorstep']]
function Icon({ name, size = 23 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-7h6v7"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h1m6 0h1m-8 3h1m6 0h1"/></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    wallet: <><path d="M21 8H4V5l14-3v6M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h17V8Zm12 5h5v5h-5Z"/></>,
    gift: <><path d="M3 10h18v4H3Zm2 4v8h14v-8M12 7v15"/><path d="M12 10C1 10 7-3 12 7c5-10 11 3 0 3Z"/></>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M3 22a9 9 0 0 1 18 0Z"/></>,
    support: <><path d="M3 13v-2a9 9 0 0 1 18 0v2M3 12h4v8H3Zm14 0h4v8h-4Zm4 7c0 4-5 4-9 4"/></>,
    logout: <><path d="M10 3H3v18h7m5-16 7 7-7 7m7-7H8"/></>,
    search: <><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></>,
    bell: <><path d="M5 17h14l-2-4V8A5 5 0 0 0 7 8v5Zm5 4h4"/></>,
    wash: <><rect x="3" y="2" width="18" height="20" rx="3"/><circle cx="12" cy="14" r="5"/><path d="M3 7h18m-14-3h1m4 0h1m-5 10c3 4 5-4 8 0"/></>,
    hanger: <path d="M10 6a2 2 0 1 1 3 2l-1 1v2L2 18v2h20v-2l-10-7"/>,
    iron: <><path d="M3 19h18l-2-10H9L3 19Zm6-10V5h9v4M2 22h20"/></>,
    truck: <><path d="M2 5h13v12H2Zm13 5h4l3 4v3h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    shield: <><path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
    heart: <path d="M12 21 3 12C-3 5 7-2 12 6c5-8 15-1 9 6Z"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.home}</svg>
}

export default function DashboardPage({ preview = false }) {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [section, setSection] = useState('Dashboard')
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recommended')
  const [category, setCategory] = useState('')
  const [favorites, setFavorites] = useState([])
  const [dialog, setDialog] = useState(null)
  if (!user && !preview) return <Navigate to="/login" replace />
  const name = user?.Name || user?.name || 'Guest'
  const email = user?.Email || user?.email || 'Sign in to view your account'
  const filtered = sortPartners(shops.filter(shop => `${shop.name} ${shop.area}`.toLowerCase().includes(search.toLowerCase()) && (!category || shop.services.includes(category))), sort)
  function choose(value) { setSection(value); setMenu(false) }
  function signOut() { dispatch(logout()); dispatch(api.util.resetApiState()); navigate('/login', { replace: true }) }
  function book(shop) { setDialog({ title: shop.name, text: `Sample price: ₹${shop.price}/kg. Services: ${shop.services.join(', ')}. Booking is not connected yet; no order or charge will be created.` }) }
  return <div className="dash">
    {menu && <button className="dash-scrim" aria-label="Close navigation" onClick={() => setMenu(false)}/>}
    <aside className={`dash-sidebar ${menu ? 'is-open' : ''}`}>
      <Link className="dash-logo" to="/" aria-label="BB LaundryLink home"><img src="/images/logo.webp" alt="BB LaundryLink — Find. Compare. Book."/></Link>
      <nav aria-label="Dashboard navigation">{navigation.map(([icon,label]) => <button key={label} className={section === label ? 'is-active' : ''} aria-current={section === label ? 'page' : undefined} onClick={() => choose(label)}><Icon name={icon}/><span>{label}</span></button>)}<button onClick={signOut}><Icon name="logout"/><span>{preview && !user ? 'Go to Login' : 'Logout'}</span></button></nav>
      <img className="dash-city-art" src="/images/dashboard-city.webp" alt="Proudly serving Bhubaneswar"/>
    </aside>
    <div className="dash-shell"><header className="dash-topbar d-flex align-items-center"><button className="dash-menu" aria-label="Toggle dashboard navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>☰</button><button className="dash-location" onClick={() => setDialog({ title: 'Your city', text: 'Currently showing sample laundry partners in Bhubaneswar. Other cities are not available yet.' })}><Icon name="pin"/> Bhubaneswar <span>⌄</span></button><label className="dash-search"><Icon name="search"/><input className="form-control" aria-label="Search laundry partners" placeholder="Search laundry services…" value={search} onChange={e => {setSearch(e.target.value); setSection('Dashboard')}}/></label><button className="dash-notifications" aria-label="Notifications" onClick={() => setDialog({ title: 'Notifications', text: 'You have no new notifications. Booking updates will appear here when live booking is connected.' })}><Icon name="bell" size={27}/></button><button className="dash-account" onClick={() => choose('My Profile')}><span className="dash-avatar">{name.slice(0,1).toUpperCase()}</span><span>Hello,<strong>{name}</strong></span><span>⌄</span></button></header>
      <main id="main-content" tabIndex={-1} className="dash-main"><div className="dash-demo-note">{preview ? 'Dashboard preview' : 'Welcome to your dashboard'} · Laundry listings, tracking, and offers below are sample content, not live account activity.</div>
        {section === 'Dashboard' ? <>
          <section className="dash-banner" aria-label="Your clothes, our priority. Clean, fresh, on time."><img src="/images/dashboard-banner.webp" alt="Your clothes, our priority — laundry made easy"/></section>
          <section className="dash-services" aria-label="Filter by service">{categories.map(([icon,title,subtitle],i) => <button key={title} className={`dash-service tone-${i} ${category === title ? 'is-selected' : ''}`} aria-pressed={category === title} onClick={() => setCategory(category === title ? '' : title)}><span className="dash-service-icon"><Icon name={icon} size={32}/></span><span><strong>{title}</strong><small>{subtitle}</small></span><b aria-hidden="true">→</b></button>)}</section>
          <div className="dash-columns"><section className="dash-partners"><div className="dash-section-title d-flex align-items-center justify-content-between"><h2><Icon name="pin" size={28}/> Nearby Laundry Partners</h2><button onClick={() => { setCategory(''); setSearch('') }}>View All →</button></div>
            {category && <p className="dash-filter">{category} <button onClick={() => setCategory('')}>Clear ×</button></p>}
            <div className="partner-toolbar dash-partner-toolbar d-flex align-items-center justify-content-between flex-wrap"><p role="status">{filtered.length} {filtered.length === 1 ? 'partner' : 'partners'} found</p><label>Sort by <select className="form-select form-select-sm" aria-label="Sort laundry partners" value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="price">Price: low to high</option><option value="rating">Highest rated</option></select></label></div><div className="dash-shop-grid row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">{filtered.map(shop => <div className="col" key={shop.id}><article className="dash-shop h-100"><div className="dash-shop-photo"><img src={`/images/dashboard-${shop.id}.webp`} alt={`${shop.name} sample storefront`}/><button className={`dash-favorite ${favorites.includes(shop.id) ? 'saved' : ''}`} aria-label={`${favorites.includes(shop.id) ? 'Unsave' : 'Save'} ${shop.name}`} aria-pressed={favorites.includes(shop.id)} onClick={() => setFavorites(favorites.includes(shop.id) ? favorites.filter(id => id !== shop.id) : [...favorites,shop.id])}><Icon name="heart" size={19}/></button></div><div className="dash-shop-body"><div className="dash-shop-title d-flex align-items-start justify-content-between"><h3>{shop.name}</h3><strong>₹{shop.price}<small>/kg</small></strong></div><p><Icon name="pin" size={14}/>{shop.area}</p><div className="dash-shop-meta d-flex align-items-center justify-content-between flex-wrap"><span><Icon name="clock" size={15}/>{shop.time} mins</span><span><Icon name="truck" size={17}/>Free Pickup</span></div><button className="btn dash-primary" onClick={() => book(shop)}>Book Now →</button></div></article></div>)}</div>
            {!filtered.length && <div className="dash-empty"><h3>No partners found</h3><p>Try another shop name, neighborhood, or service.</p><button onClick={() => {setSearch('');setCategory('')}}>Clear filters</button></div>}
            <div className="dash-trust">{[['shield','100% Secure','& Trusted'],['heart','Trusted','Partners'],['support','24/7','Support'],['heart','Fresh Clothes,','Happier You']].map(([icon,a,b]) => <div key={a}><Icon name={icon} size={32}/><strong>{a}<br/>{b}</strong></div>)}</div>
          </section><aside className="dash-widgets"><section className="dash-tracking"><h2><Icon name="truck"/>Track Your Order <small>Sample order</small></h2><ol>{['Picked Up','In Process','Ready','Delivered'].map((label,i) => <li key={label} className={i === 0 ? 'complete' : ''}><span>{i === 0 ? '✓' : i === 1 ? '◉' : i === 2 ? '♧' : '✓'}</span><strong>{label}</strong></li>)}</ol><button className="btn dash-primary" onClick={() => choose('Track Order')}>View Details →</button></section><section className="dash-wallet d-flex align-items-center"><Icon name="wallet" size={35}/><div><h2>My Wallet</h2><strong>—</strong><small>Not connected</small></div><button onClick={() => choose('My Wallet')}>Add Money +</button></section><section className="dash-offer"><span className="dash-present" aria-hidden="true"><Icon name="gift" size={50}/></span><div><span className="dash-offer-tag">Sample offer</span><h2>Get 15% OFF</h2><p>on Your First Booking</p><code>WELCOME15</code></div><button onClick={() => choose('Offers & Deals')}>View →</button></section><p className="dash-signature">BB LaundryLink<br/><span>Your Laundry, Our Care ♥</span></p></aside></div>
        </> : <section className="dash-content-panel"><button className="dash-back" onClick={() => choose('Dashboard')}>← Dashboard</button><h1>{section}</h1>{section === 'My Profile' ? <><div className="dash-profile-avatar">{name.slice(0,1).toUpperCase()}</div><h2>{name}</h2><p>{email}</p><p>Account type: {user?.Role || user?.role || 'Preview guest'}</p><p className="dash-muted">Profile editing is not connected yet.</p></> : section === 'Support' ? <><h2>How can we help?</h2><p>For account and laundry questions, contact our support team.</p><a className="btn dash-primary" href="mailto:support@bblaundrylink.com">Email Support</a></> : <><Icon name={navigation.find(([,label]) => label === section)?.[0]} size={48}/><h2>{section === 'My Bookings' ? 'No live bookings to display' : section === 'Track Order' ? 'Order tracking is not connected yet' : section === 'My Wallet' ? 'Your wallet is coming soon' : 'Offers are coming soon'}</h2><p>{section === 'My Wallet' ? 'No balance or transactions are available. Adding money is disabled until payments are connected.' : section === 'Offers & Deals' ? 'WELCOME15 is a sample promotion, not an active redeemable offer.' : 'The dashboard shows a design preview. Orders and status updates will appear here once the booking API is available.'}</p></>}</section>}
      </main>
    </div>
    {dialog && <div className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" onClick={() => setDialog(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={dialog.title} onClick={e => e.stopPropagation()}><button autoFocus className="close" aria-label="Close dialog" onClick={() => setDialog(null)}>×</button><h2>{dialog.title}</h2><p>{dialog.text}</p><button className="btn dash-primary" onClick={() => setDialog(null)}>Got it</button></section></div>}
  </div>
}
