import { useState } from 'react'
import { sortPartners } from '../utils/sortPartners'
import { Link } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { api } from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { clearFilters, setQuery, setService } from '../features/filters/filtersSlice'

const partners = [
  { id: 'freshwash', name: 'FreshWash Laundry', area: 'Patia, Bhubaneswar', price: 50, old: 70, rating: 4.6, distance: '1.2', time: 30, services: ['Wash & Fold', 'Ironing Service', 'Home Pickup & Delivery'] },
  { id: 'cleancare', name: 'CleanCare Laundry', area: 'Kharavela Nagar, BBSR', price: 60, old: 80, rating: 4.5, distance: '2.1', time: 40, services: ['Wash & Fold', 'Dry Cleaning', 'Home Pickup & Delivery'] },
  { id: 'smartwash', name: 'SmartWash Laundry', area: 'IRC Village, BBSR', price: 45, old: 65, rating: 4.7, distance: '3.0', time: 50, services: ['Wash & Fold', 'Ironing Service', 'Dry Cleaning', 'Express Service', 'Home Pickup & Delivery'] },
]
const services = [['hanger', 'Wash & Fold'], ['shirt', 'Ironing Service'], ['suit', 'Dry Cleaning'], ['truck', 'Home Pickup & Delivery'], ['basket', 'Express Service']]
function Icon({ name, size = 24 }) {
  const paths = {
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    search: <><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></>,
    hanger: <><path d="M10 6a2 2 0 1 1 3 2l-1 1v2L2 18v2h20v-2l-10-7"/></>,
    shirt: <path d="m8 3-6 4 3 5 3-2v12h8V10l3 2 3-5-6-4c-1 4-7 4-8 0Z"/>,
    suit: <><path d="m8 2-4 3-2 15 5 1 1-12v13h8V9l1 12 5-1-2-15-4-3-4 11Z"/><path d="m10 2 2 3 2-3m-2 3v8"/></>,
    truck: <><path d="M2 5h13v12H2Zm13 5h4l3 4v3h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    basket: <><path d="M3 8h18l-2 13H5ZM7 8l5-6 5 6M8 12v5m4-5v5m4-5v5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    shield: <><path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
    bell: <><path d="M5 17h14l-2-4V8a5 5 0 0 0-10 0v5Zm5 4h4"/></>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></>,
    home: <><path d="m2 11 10-9 10 9M5 9v13h14V9M10 22v-8h4v8"/></>,
    support: <><path d="M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v8H3Zm14 0h4v8h-4Zm4 7c0 4-5 4-9 4"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.shield}</svg>
}
function HomePage() {
  const [area, setArea] = useState('')
  const [sort, setSort] = useState('recommended')
  const { query, service } = useSelector(state => state.filters)
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [dialog, setDialog] = useState(null)
  const [menu, setMenu] = useState(false)
  const filtered = sortPartners(partners.filter(p => (!service || p.services.includes(service)) && `${p.name} ${p.area} bhubaneswar`.toLowerCase().includes(query.toLowerCase())), sort)
  function search(e) { e.preventDefault(); dispatch(setQuery(area.trim())); document.getElementById('partners').scrollIntoView({ behavior: 'smooth' }) }
  return <>
    <header className="header d-flex align-items-center">
      <a href="#home" className="brand" aria-label="BB LaundryLink home"><img src="/images/logo.webp" alt="BB LaundryLink — Find. Compare. Book." /></a>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle navigation">☰</button>
      <nav className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">
        <a className="active" href="#home" onClick={() => setMenu(false)}><Icon name="home" size={18}/> Home</a><a href="#partners">Find Laundry⌄</a><button onClick={() => setDialog({ type: 'how' })}>How It Works</button><a href="#partners">Our Partners</a><button onClick={() => setDialog({ type: 'about' })}>About Us</button><a href="mailto:support@bblaundrylink.com">Contact</a>
      </nav>
      <div className="account d-flex align-items-center"><button className="bell" aria-label="Notifications" onClick={() => setDialog({ type: 'notifications' })}><Icon name="bell"/></button>{user ? <><Link className="account-name" to="/dashboard">Hi, {user.Name || user.name || 'there'}</Link><button className="btn outline" onClick={() => { dispatch(logout()); dispatch(api.util.resetApiState()) }}>Logout</button></> : <><Link className="btn outline" to="/login"><Icon name="user" size={18}/> Login</Link><Link className="btn orange" to="/register"><Icon name="user" size={18}/> Register</Link></>}</div>
    </header>
    <main id="main-content" tabIndex={-1}>
      <section className="hero" id="home">
        <div className="hero-photo" role="img" aria-label="Friendly laundry professional with fresh folded towels"/>
        <div className="hero-content"><div className="eyebrow">FRESH CLOTHES. LESS HASSLE.</div><h1>BB Laundry<span>Link</span></h1><h2>Find. Compare. Book.</h2><p>Discover the best laundry services near you<br className="desktop"/> with transparent prices and trusted partners.</p>
          <form className="search-form" onSubmit={search}><div className="location-input"><Icon name="pin"/><input className="form-control" aria-label="Enter your area" placeholder="Enter your area (e.g. Bhubaneswar)" value={area} onChange={e => setArea(e.target.value)}/><span>⌄</span></div><button className="btn orange" type="submit"><Icon name="search"/> Search</button></form>
          <div className="hero-benefits">{[['ϟ', 'Quick', 'Booking'], ['✓', 'Trusted', 'Partners'], ['◆', 'Best', 'Prices'], ['★', 'Top Rated', 'Services']].map(([icon,a,b]) => <div key={a}><b>{icon}</b><span>{a}<br/>{b}</span></div>)}</div>
        </div><div className="wave wave-blue"/><div className="wave wave-orange"/>
      </section>
      <section className="services" aria-label="Filter by laundry service">{services.map(([icon,label]) => <button key={label} className={service === label ? 'selected' : ''} aria-pressed={service === label} onClick={() => dispatch(setService(service === label ? '' : label))}><Icon name={icon} size={42}/><span>{label}</span></button>)}</section>
      <section className="marketplace" id="partners"><div className="partners"><div className="section-heading"><div><h2>Nearby Laundry Partners</h2><p>Compare prices, choose the best, and book instantly!</p></div><button className="city" onClick={() => { document.querySelector('.location-input input').focus(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Icon name="pin" size={19}/> Bhubaneswar ⌄</button></div>
        {(service || query) && <div className="filter-info">Showing {service || 'all services'}{query && ` near “${query}”`} <button onClick={() => {dispatch(clearFilters());setArea('')}}>Clear filters ×</button></div>}
        <div className="partner-toolbar d-flex align-items-center justify-content-between flex-wrap"><p role="status">{filtered.length} {filtered.length === 1 ? 'partner' : 'partners'} found <span>· Sample listings</span></p><label>Sort by <select className="form-select form-select-sm" aria-label="Sort laundry partners" value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="price">Price: low to high</option><option value="rating">Highest rated</option></select></label></div><div className="partner-grid row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">{filtered.map(p => <div className="col" key={p.id}><article className="partner-card h-100"><div className="shop-image"><img src={`/images/${p.id}.webp`} alt={`${p.name} storefront`}/><span className="rating">★ {p.rating}</span></div><div className="card-body"><div className="card-title d-flex align-items-center justify-content-between"><h3>{p.name}</h3><div className="price">₹{p.price}<small>/kg</small></div></div><div className="card-location d-flex align-items-center justify-content-between"><span><Icon name="pin" size={16}/>{p.area}</span><del>₹{p.old}/kg</del></div><div className="card-bottom d-flex align-items-center justify-content-between"><span><Icon name="truck" size={16}/>{p.distance} km</span><span><Icon name="clock" size={16}/>{p.time} mins</span><button className="btn outline" onClick={() => setDialog({ type: 'partner', partner: p })}>View Details →</button></div></div></article></div>)}</div>
        {!filtered.length && <div className="empty"><Icon name="search" size={36}/><h3>No laundry partners found</h3><p>Try Bhubaneswar, Patia, Kharavela Nagar, or IRC Village.</p><button className="btn outline" onClick={() => {dispatch(clearFilters());setArea('')}}>Show all partners</button></div>}
      </div><aside className="booking-banner"><div className="banner-bubble"/><h2>Book Laundry<br/>in Just a Few Clicks!</h2><ul><li>Find Nearby Shops</li><li>Compare Prices</li><li>Track Your Order</li></ul><button className="btn orange" onClick={() => document.getElementById('partners').scrollIntoView({ behavior: 'smooth' })}>Start Booking <span>→</span></button><div className="phone" aria-hidden="true"><div className="notch"/><img src="/images/logo.webp" alt=""/><div className="map-pins">📍<br/> 📍<br/>📍</div></div></aside></section>
    </main>
    <footer>{[['support','24/7 Support',"We're always here to help"],['shield','Secure & Reliable','Your trust, our priority'],['user','Trusted Community','Connecting local laundry partners'],['truck','Grow Together','For a cleaner, fresher city']].map(([icon,title,text]) => <div className="footer-item" key={title}><Icon name={icon} size={43}/><div><h3>{title}</h3><p>{text}</p></div></div>)}</footer>
    {dialog && <div className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" onClick={() => setDialog(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={dialog.partner?.name || dialog.type} onClick={e => e.stopPropagation()}><button autoFocus className="close" aria-label="Close dialog" onClick={() => setDialog(null)}>×</button>
      {dialog.type === 'partner' ? <><img className="modal-shop" src={`/images/${dialog.partner.id}.webp`} alt={dialog.partner.name}/><h2>{dialog.partner.name}</h2><p>{dialog.partner.area} · ★ {dialog.partner.rating}</p><h3>From ₹{dialog.partner.price}/kg</h3><p>{dialog.partner.services.join(' · ')}</p><p className="notice">This is a homepage preview. Live availability and booking will be available when the booking service is connected.</p></> : dialog.type === 'how' ? <><h2>Fresh laundry in 3 easy steps</h2><ol><li>Find a laundry partner in your area.</li><li>Compare services, prices, and ratings.</li><li>Choose your service and arrange a pickup.</li></ol></> : dialog.type === 'about' ? <><h2>Your laundry, our priority.</h2><p>BB LaundryLink helps you discover and compare local laundry partners — all in one place, with clear prices and convenient services.</p></> : <><h2>You're all caught up</h2><p>Your booking updates will appear here.</p></>}
    </section></div>}
  </>
}
export default HomePage
