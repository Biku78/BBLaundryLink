import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../components/DashboardIcon";
import Modal from "../components/Modal";
import { samplePartners } from "../data/samplePartners";
import { estimateLaundry, pricingServices } from "../utils/estimateLaundry";
import { sortPartners } from "../utils/sortPartners";
import {
  clearFilters,
  setQuery,
  setService,
} from "../features/filters/filtersSlice";
import { logout } from "../features/auth/authSlice";
import { api } from "../services/api";
import "./DashboardPage.css";
import "./HomePage.css";

const serviceCards = [
  {
    name: "Wash & Fold",
    icon: "wash",
    price: "₹45/kg",
    image: "/images/service-wash.webp",
    calculator: "Wash & Fold",
  },
  {
    name: "Ironing",
    icon: "iron",
    price: "₹20/piece",
    image: "/images/service-iron.webp",
    calculator: "Ironing",
  },
  {
    name: "Dry Cleaning",
    icon: "hanger",
    price: "₹100/kg",
    image: "/images/service-dry.webp",
    calculator: "Dry Cleaning",
  },
  {
    name: "Pickup & Delivery",
    icon: "truck",
    price: "Doorstep care",
    image: "/images/service-pickup.webp",
  },
  {
    name: "Shoe & Premium",
    icon: "shield",
    price: "₹149/pair",
    image: "/images/service-shoe.webp",
    calculator: "Shoe Care",
  },
];
const faq = [
  [
    "How does BB LaundryLink work?",
    "Explore local laundry partners, compare their sample prices and services, and estimate your laundry cost. Account creation and login are connected; live booking is still being developed.",
  ],
  [
    "Is pickup really free?",
    "Pickup is included at no extra charge in this sample calculator. Actual pickup fees and availability must be confirmed by your selected partner once live booking launches.",
  ],
  [
    "How are prices decided?",
    "Each partner sets its own rates. This preview uses sample rates per kg, piece, or pair. The calculator shows the lowest available sample rate for your chosen service, with an optional 30% express surcharge.",
  ],
  [
    "Can I track my order live?",
    "Not yet. The dashboard tracking panel is a clearly labeled design sample. Live order tracking will be available when the booking and delivery services are connected.",
  ],
  [
    "What if my clothes are damaged?",
    "Contact support@bblaundrylink.com for help. Partner-specific care, liability, cancellation, and compensation policies need to be confirmed before placing a live booking.",
  ],
];
const money = (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export default function HomePage() {
  const dispatch = useDispatch();
  const { query, service } = useSelector((state) => state.filters);
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState(query);
  const [city, setCity] = useState("Bhubaneswar");
  const [menu, setMenu] = useState(false);
  const [sort, setSort] = useState("nearest");
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [quantity, setQuantity] = useState(4);
  const [pricingService, setPricingService] = useState("Wash & Fold");
  const [express, setExpress] = useState(false);
  const [dialog, setDialog] = useState(null);
  const partnersRef = useRef(null);
  const calculatorRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const estimate = estimateLaundry(
    samplePartners,
    pricingService,
    quantity,
    express,
  );
  const filtered = sortPartners(
    samplePartners.filter(
      (partner) =>
        `${partner.name} ${partner.area} ${partner.services.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!service || partner.services.includes(service)),
    ),
    sort,
  );
  const compared = selected.map((id) =>
    samplePartners.find((partner) => partner.id === id),
  );

  useEffect(() => {
    if (!menu) return;
    function closeMenu(event) {
      if (event.key === "Escape") {
        setMenu(false);
        menuButtonRef.current?.focus();
      }
      if (
        event.type === "pointerdown" &&
        !menuRef.current?.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      )
        setMenu(false);
    }
    document.addEventListener("keydown", closeMenu);
    document.addEventListener("pointerdown", closeMenu);
    return () => {
      document.removeEventListener("keydown", closeMenu);
      document.removeEventListener("pointerdown", closeMenu);
    };
  }, [menu]);

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenu(false);
  }
  function submitSearch(event) {
    event.preventDefault();
    dispatch(setQuery(search.trim()));
    scrollTo(partnersRef);
  }
  function chooseArea(area) {
    setSearch(area);
    dispatch(setQuery(area));
    scrollTo(partnersRef);
  }
  function resetFilters() {
    setSearch("");
    dispatch(clearFilters());
  }
  function toggleCompare(id) {
    if (selected.includes(id))
      setSelected(selected.filter((value) => value !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
    else
      setDialog({
        type: "notice",
        title: "Compare up to 3 partners",
        text: "Remove a selected partner before adding another.",
      });
  }
  function selectService(item) {
    if (!item.calculator) {
      setDialog({
        type: "notice",
        title: "Pickup & Delivery",
        text: "Doorstep pickup is part of our planned service. Live availability and pickup fees are not connected yet. The calculator currently includes sample pickup at no extra charge.",
      });
      return;
    }
    setPricingService(item.calculator);
    scrollTo(calculatorRef);
  }
  function book(partner, total) {
    setDialog({
      type: "notice",
      title: `Booking preview · ${partner.name}`,
      text: `${total ? `Your estimated total is ${money(total)}. ` : `Sample wash & fold pricing starts at ${money(partner.price)}/kg. `}Live booking and payment are not connected yet. No order or charge will be created. Sign in to explore your account dashboard.`,
    });
  }
  function signOut() {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    setMenu(false);
  }

  return (
    <div className="customer-dash landing-page">
      <header className="bento-topbar landing-topbar d-flex align-items-center justify-content-between gap-2">
        <Link
          className="bento-brand d-flex align-items-center gap-2"
          to="/"
          aria-label="BB LaundryLink home"
        >
          <span className="bento-brand-icon">
            <Icon name="wash" size={28} />
            <small>BB</small>
          </span>
          <span>
            <strong>
              BB{" "}
              <span>
                Laundry<em>Link</em>
              </span>
            </strong>
            <small>FIND • COMPARE • BOOK</small>
          </span>
        </Link>
        <div className="d-flex align-items-center gap-2 landing-nav-actions">
          <button
            className="btn bento-notifications"
            aria-label="Notifications"
            onClick={() =>
              setDialog({
                type: "notice",
                title: "Notifications",
                text: "There are no live notifications to display. Sign in to access your customer dashboard.",
              })
            }
          >
            <Icon name="bell" />
          </button>
          {user ? (
            <Link className="btn bento-dark" to="/dashboard">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link className="btn landing-login" to="/login">
                Login
              </Link>
              <Link className="btn bento-orange" to="/register">
                Register
              </Link>
            </>
          )}
          <button
            ref={menuButtonRef}
            className="btn landing-menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            aria-controls="landing-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? "×" : "☰"}
          </button>
        </div>
        {menu && (
          <nav
            ref={menuRef}
            id="landing-navigation"
            className="landing-menu"
            aria-label="Main navigation"
          >
            <a href="#landing-services" onClick={() => setMenu(false)}>
              Our services
            </a>
            <button onClick={() => scrollTo(calculatorRef)}>
              Price calculator
            </button>
            <button onClick={() => scrollTo(partnersRef)}>
              Laundry partners
            </button>
            <a href="#how-it-works" onClick={() => setMenu(false)}>
              How it works
            </a>
            <a href="#landing-faq" onClick={() => setMenu(false)}>
              FAQs
            </a>
            <a href="mailto:support@bblaundrylink.com">Contact support</a>
            {user && <button onClick={signOut}>Logout</button>}
          </nav>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="landing-main">
        <section className="landing-hero">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-xl-7">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="bento-chip">
                  <Icon name="pin" size={16} /> Smart City Bhubaneswar
                </span>
                <span className="landing-dark-chip">
                  ✦ A fresher way to do laundry
                </span>
              </div>
              <h1>
                Laundry,
                <br />
                but make it
                <br />
                <span>Happier.</span>
              </h1>
              <p>
                Discover the best laundry near you with{" "}
                <strong>transparent prices</strong> and trusted partners. Find.
                Compare. Book — in just a few clicks.
              </p>
              <form
                className="landing-search d-flex align-items-center gap-2"
                onSubmit={submitSearch}
              >
                <label className="landing-city d-flex align-items-center gap-2">
                  <Icon name="pin" />
                  <select
                    className="form-select"
                    aria-label="Select city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  >
                    <option>Bhubaneswar</option>
                  </select>
                </label>
                <label className="landing-search-input d-flex align-items-center gap-2 flex-grow-1">
                  <Icon name="search" />
                  <input
                    className="form-control"
                    aria-label="Search laundry partners"
                    placeholder="Search FreshWash, SmartWash, or an area…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <button className="btn bento-orange" type="submit">
                  <Icon name="search" size={19} /> Search
                </button>
              </form>
              <div className="landing-area-chips d-flex flex-wrap gap-2">
                {["Patia", "Saheed Nagar", "IRC Village", "Nayapalli"].map(
                  (area) => (
                    <button
                      className="btn"
                      key={area}
                      onClick={() => chooseArea(area)}
                    >
                      <Icon name="pin" size={12} />
                      {area}
                    </button>
                  ),
                )}
              </div>
              <div className="row row-cols-2 row-cols-md-4 g-3 landing-benefits">
                {[
                  ["clock", "Quick Booking", "Easy to explore"],
                  ["shield", "Local Partners", "Find your fit"],
                  ["gift", "Clear Prices", "Compare & save"],
                  ["heart", "Care First", "Freshness matters"],
                ].map(([icon, title, text]) => (
                  <div
                    className="col d-flex align-items-center gap-2"
                    key={title}
                  >
                    <span>
                      <Icon name={icon} />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-xl-5">
              <div className="landing-visual">
                <div className="landing-photo-ring">
                  <svg className="landing-ring-lettering" viewBox="0 0 500 500" aria-hidden="true">
                    <defs><path id="landing-fresh-circle" d="M250,250 m-229,0 a229,229 0 1,1 458,0 a229,229 0 1,1 -458,0" /></defs>
                    <text><textPath href="#landing-fresh-circle" textLength="1438" lengthAdjust="spacing">FRESH • CLEAN • ON TIME • FRESH • CLEAN • ON TIME • </textPath></text>
                  </svg>
                  <img
                    src="/images/landing-fresh.webp"
                    alt="Customer caring for her fresh laundry beside a washing machine"
                    fetchPriority="high"
                  />
                </div>
                <span className="landing-photo-badge first">
                  <span>
                    <Icon name="heart" />
                  </span>
                  <strong>
                    Care in every wash<small>Freshness, made simple</small>
                  </strong>
                </span>
                <span className="landing-photo-badge second">
                  <span>
                    <Icon name="truck" />
                  </span>
                  <strong>
                    Doorstep convenience<small>Pickup options planned</small>
                  </strong>
                </span>
                <span className="landing-photo-caption">
                  YOUR LAUNDRY.
                  <br />
                  <strong>Our Priority! ♥</strong>
                </span>
              </div>
            </div>
          </div>
        </section>
        <div className="landing-ribbon d-flex justify-content-center flex-wrap gap-3 gap-md-5">
          <span>✦ LAUNDRY CARE IN BHUBANESWAR</span>
          <span>✦ FRESH CLOTHES, HAPPIER YOU</span>
          <span>✦ FIND • COMPARE • BOOK</span>
        </div>

        <section id="landing-services" className="landing-section">
          <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-4">
            <div>
              <span className="landing-eyebrow">OUR SERVICES</span>
              <h2>
                Explore a little <em>freshness.</em>
              </h2>
            </div>
            <p className="landing-muted">
              Hover, tap, or use your keyboard to calculate a sample price →
            </p>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-3">
            {serviceCards.map((item) => (
              <div className="col" key={item.name}>
                <button
                  className="btn landing-service w-100"
                  onClick={() => selectService(item)}
                  aria-label={`Calculate price for ${item.name}`}
                >
                  <img src={item.image} alt="" loading="lazy" />
                  <span className="landing-service-top d-flex justify-content-between gap-2">
                    <span>
                      <Icon name={item.icon} size={26} />
                    </span>
                    <small>{item.price}</small>
                  </span>
                  <span className="landing-service-bottom">
                    <strong>{item.name}</strong>
                    <span>Calculate Price ↗</span>
                  </span>
                </button>
              </div>
            ))}
          </div>
          <p className="landing-sample-note">
            Illustrative service rates and imagery. Live availability and final
            partner prices are not connected yet.
          </p>
        </section>

        <section
          ref={calculatorRef}
          id="price-calculator"
          className="landing-calculator landing-section"
        >
          <div className="row g-0">
            <div className="col-12 col-xl-7 landing-calculator-controls">
              <span className="landing-eyebrow">₹ SAMPLE PRICE CALCULATOR</span>
              <h2>
                Know your price
                <br />
                <em>before you book.</em>
              </h2>
              <p>
                Choose a service and quantity. We’ll calculate an estimate using
                the lowest available sample rate.
              </p>
              <div className="d-flex align-items-center justify-content-between gap-2 landing-quantity-label">
                <label htmlFor="laundry-quantity">
                  How many {estimate.unit === "kg" ? "kg" : `${estimate.unit}s`}
                  ?
                </label>
                <output htmlFor="laundry-quantity">
                  {quantity} {estimate.unit}
                  {estimate.unit !== "kg" && quantity > 1 ? "s" : ""}
                </output>
              </div>
              <input
                className="form-range"
                id="laundry-quantity"
                type="range"
                min="1"
                max="15"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                aria-valuetext={`${quantity} ${estimate.unit}${quantity !== 1 && estimate.unit !== "kg" ? "s" : ""}`}
              />
              <div className="d-flex justify-content-between landing-range-label">
                <span>1</span>
                <span>15</span>
              </div>
              <div className="d-flex flex-wrap gap-2 landing-price-options">
                {pricingServices.map((item) => {
                  const lowest = estimateLaundry(samplePartners, item.name, 1);
                  return (
                    <button
                      type="button"
                      key={item.name}
                      className={`btn ${pricingService === item.name ? "selected" : ""}`}
                      aria-pressed={pricingService === item.name}
                      onClick={() => setPricingService(item.name)}
                    >
                      {item.name} • {money(lowest.rate)}/{item.unit}
                    </button>
                  );
                })}
              </div>
              <label className="landing-express d-flex align-items-center gap-2">
                <Icon name="clock" size={20} />
                <span>
                  Express service (+30%)<small>Illustrative surcharge</small>
                </span>
                <input
                  className="form-check-input ms-auto"
                  type="checkbox"
                  checked={express}
                  onChange={(event) => setExpress(event.target.checked)}
                />
              </label>
            </div>
            <div className="col-12 col-xl-5 landing-calculator-total d-flex flex-column">
              <span className="landing-eyebrow">ESTIMATED TOTAL</span>
              <div
                className="landing-estimate"
                aria-live="polite"
                aria-atomic="true"
              >
                <strong>{money(estimate.total)}</strong>
                <p>
                  {pricingService} • {quantity} {estimate.unit}
                  {quantity > 1 && estimate.unit !== "kg" ? "s" : ""} • Sample
                  pickup included
                </p>
              </div>
              <dl className="landing-price-breakdown">
                <div>
                  <dt>
                    {money(estimate.rate)} × {quantity} {estimate.unit}
                  </dt>
                  <dd>{money(estimate.subtotal)}</dd>
                </div>
                {express && (
                  <div>
                    <dt>Express surcharge (30%)</dt>
                    <dd>{money(estimate.expressFee)}</dd>
                  </div>
                )}
              </dl>
              <div className="landing-best-price d-flex align-items-center gap-3">
                <img src={estimate.partner.image} alt={estimate.partner.name} />
                <div>
                  <small>LOWEST SAMPLE RATE</small>
                  <strong>
                    {estimate.partner.name} • {money(estimate.rate)}/
                    {estimate.unit}
                  </strong>
                  <span>{estimate.partner.area}</span>
                </div>
                <span aria-hidden="true">★</span>
              </div>
              <button
                className="btn bento-blue w-100 mt-auto"
                onClick={() => book(estimate.partner, estimate.total)}
              >
                Preview booking at {money(estimate.total)} →
              </button>
              <p className="landing-sample-note text-center">
                Estimate only — no booking or payment will be created.
              </p>
            </div>
          </div>
        </section>

        <section
          ref={partnersRef}
          id="laundry-partners"
          className="landing-section landing-partners"
        >
          <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-4">
            <div>
              <span className="landing-eyebrow">FIND • COMPARE • BOOK</span>
              <h2>Nearby Laundry Partners</h2>
              <p className="landing-muted">
                Select 2–3 shops to compare prices, ratings, and distance side
                by side.
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <label className="landing-sort">
                <span className="visually-hidden">Sort laundry partners</span>
                <select
                  className="form-select"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="nearest">Sort: Nearest</option>
                  <option value="price">Price: low to high</option>
                  <option value="rating">Highest rated</option>
                </select>
              </label>
              <span className="bento-chip green">
                <Icon name="pin" size={16} />
                Bhubaneswar
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap landing-filter-row">
            <div className="d-flex flex-wrap gap-2">
              {["", "Wash & Fold", "Ironing", "Dry Cleaning"].map((value) => (
                <button
                  className={`btn bento-filter ${service === value ? "active" : ""}`}
                  aria-pressed={service === value}
                  key={value}
                  onClick={() => dispatch(setService(value))}
                >
                  {value || "All services"}
                </button>
              ))}
            </div>
            <p role="status">
              {filtered.length} sample{" "}
              {filtered.length === 1 ? "partner" : "partners"}
              {query && ` for “${query}”`}{" "}
              {(query || service) && (
                <button className="btn bento-link" onClick={resetFilters}>
                  Clear filters ×
                </button>
              )}
            </p>
          </div>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {filtered.map((partner) => (
              <div className="col" key={partner.id}>
                <article className="bento-shop landing-shop h-100">
                  <div className="bento-shop-photo">
                    <img
                      src={partner.image}
                      alt={`${partner.name} sample laundry facility`}
                      loading="lazy"
                    />
                    <span className="bento-shop-rating">
                      ★ <strong>{partner.rating}</strong>
                      <small>Sample rating</small>
                    </span>
                    <button
                      className={`btn bento-favorite ${favorites.includes(partner.id) ? "saved" : ""}`}
                      aria-label={`${favorites.includes(partner.id) ? "Unsave" : "Save"} ${partner.name}`}
                      aria-pressed={favorites.includes(partner.id)}
                      onClick={() =>
                        setFavorites(
                          favorites.includes(partner.id)
                            ? favorites.filter((id) => id !== partner.id)
                            : [...favorites, partner.id],
                        )
                      }
                    >
                      <Icon name="heart" size={21} />
                    </button>
                    <span className="bento-shop-tag">{partner.tag}</span>
                  </div>
                  <div className="bento-shop-body">
                    <div className="d-flex justify-content-between gap-2 mb-3">
                      <h3>{partner.name}</h3>
                      <div className="bento-shop-price">
                        {money(partner.price)}
                        <small>/kg</small>
                        <del>{money(partner.old)}/kg</del>
                      </div>
                    </div>
                    <p>
                      <Icon name="pin" size={16} />
                      {partner.area}
                    </p>
                    <div className="d-flex flex-wrap gap-3 bento-shop-meta">
                      <span>
                        <Icon name="pin" size={15} />
                        {partner.distance} km
                      </span>
                      <span>
                        <Icon name="clock" size={16} />
                        {partner.time} mins
                      </span>
                      <span className="landing-offer-text">
                        {partner.offer}
                      </span>
                    </div>
                    <div className="landing-shop-actions d-flex gap-2 mt-4">
                      <button
                        className="btn bento-dark flex-grow-1"
                        onClick={() => book(partner)}
                      >
                        Book Now →
                      </button>
                      <button
                        className={`btn landing-compare-button ${selected.includes(partner.id) ? "selected" : ""}`}
                        aria-label={`${selected.includes(partner.id) ? "Remove" : "Compare"} ${partner.name}`}
                        aria-pressed={selected.includes(partner.id)}
                        onClick={() => toggleCompare(partner.id)}
                      >
                        ⚖ {selected.includes(partner.id) ? "Added" : "Compare"}
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
          {!filtered.length && (
            <div className="bento-empty text-center py-5">
              <Icon name="search" size={40} />
              <h3>No laundry partners found</h3>
              <p>Try another name, area, or service.</p>
              <button className="btn bento-blue" onClick={resetFilters}>
                Show all partners
              </button>
            </div>
          )}
        </section>

        <section
          id="how-it-works"
          className="landing-how bento-surface landing-section"
        >
          <div className="row g-5 align-items-center">
            <div className="col-12 col-xl-6">
              <div className="landing-how-photo">
                <img
                  src="/images/landing-fresh.webp"
                  alt="Laundry being carefully checked beside a washing machine"
                  loading="lazy"
                />
                <button
                  className="btn bento-dark"
                  onClick={() =>
                    setDialog({
                      type: "notice",
                      title: "How BB LaundryLink works",
                      text: "1. Explore and compare sample partners. 2. Use the calculator to estimate your laundry cost. 3. Create an account and sign in. Live pickup, payment, and delivery are still in development; there is no product video available yet.",
                    })
                  }
                >
                  ▶ How it works<span>See the quick guide</span>
                </button>
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <span className="landing-eyebrow">HOW IT WORKS</span>
              <h2>
                Fresh clothes in <em>3 simple steps</em>
              </h2>
              <div className="landing-steps">
                {[
                  [
                    "calendar",
                    "Choose your laundry",
                    "Compare partners, services, and sample prices in one place.",
                  ],
                  [
                    "truck",
                    "Arrange a pickup",
                    "Doorstep collection will be available once live booking launches.",
                  ],
                  [
                    "wash",
                    "Enjoy your fresh start",
                    "Laundry care made simpler, with delivery updates planned.",
                  ],
                ].map(([icon, title, text], i) => (
                  <div className="d-flex gap-3" key={title}>
                    <span className="bento-heading-icon">
                      <Icon name={icon} size={27} />
                    </span>
                    <div>
                      <small>STEP 0{i + 1}</small>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn bento-dark"
                onClick={() => scrollTo(partnersRef)}
              >
                Explore Partners →
              </button>
            </div>
          </div>
        </section>
        <section className="landing-section">
          <div className="row row-cols-2 row-cols-lg-4 g-3">
            {[
              ["home", "6", "Sample partners"],
              ["user", "One place", "To find & compare"],
              ["heart", "Care first", "Freshness matters"],
              ["clock", "Your time", "Made for more"],
            ].map(([icon, value, label]) => (
              <div className="col" key={label}>
                <div className="landing-stat bento-surface d-flex align-items-center gap-3 h-100">
                  <span className="bento-heading-icon">
                    <Icon name={icon} size={27} />
                  </span>
                  <div>
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="landing-reviews landing-section">
          <h2 className="text-center">
            Made for life in <em>Bhubaneswar ♥</em>
          </h2>
          <p className="landing-muted text-center mb-4">
            Illustrative customer stories — not verified reviews.
          </p>
          <div className="row g-3">
            {[
              [
                "Everyday convenience",
                "A simple way to compare laundry options around my neighborhood.",
              ],
              [
                "A clearer laundry day",
                "Being able to estimate prices before choosing a partner makes planning easier.",
              ],
              [
                "A little more me-time",
                "The idea of one place for laundry care and pickup is exactly what a busy week needs.",
              ],
            ].map(([title, text], i) => (
              <div className="col-12 col-md-4" key={title}>
                <figure
                  className={`landing-review h-100 ${i === 1 ? "dark" : ""}`}
                >
                  <span aria-hidden="true">“</span>
                  <blockquote>{text}</blockquote>
                  <figcaption>
                    <strong>{title}</strong>
                    <small>Illustrative story</small>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </section>
        <section className="landing-app-banner landing-section">
          <span className="landing-eyebrow">
            YOUR EVERYDAY LAUNDRY COMPANION
          </span>
          <h2>
            Book Laundry
            <br />
            in Just a Few Clicks!
          </h2>
          <p>One account. Local laundry options. A fresher routine.</p>
          <Link
            className="btn bento-orange"
            to={user ? "/dashboard" : "/register"}
          >
            {user ? "Open Dashboard →" : "Create Your Account →"}
          </Link>
          <span className="landing-app-icon" aria-hidden="true">
            <Icon name="wash" size={180} />
          </span>
        </section>
        <section id="landing-faq" className="landing-faq landing-section">
          <h2 className="text-center mb-4">
            Frequently Asked <em>Questions</em>
          </h2>
          {faq.map(([question, answer]) => (
            <details className="bento-surface" key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
        <section className="landing-final-cta landing-section text-center">
          <h2>
            Your Laundry,
            <br />
            <em>Our Priority!</em>
          </h2>
          <p>Explore a simpler way to care for your clothes in Bhubaneswar.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn bento-orange"
              onClick={() => scrollTo(partnersRef)}
            >
              Find Laundry Near Me →
            </button>
            <Link
              className="btn landing-white-button"
              to={user ? "/dashboard" : "/login"}
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {[
            ["support", "Support", "We’re here to help"],
            ["shield", "Secure & Reliable", "Your trust, our priority"],
            ["user", "Local Community", "Connecting neighborhoods"],
            ["heart", "Fresh Clothes", "Happier you"],
          ].map(([icon, title, text]) => (
            <div className="col d-flex align-items-center gap-3" key={title}>
              <span>
                <Icon name={icon} size={26} />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="landing-footer-bottom d-flex justify-content-between flex-wrap gap-3">
          <Link className="bento-brand" to="/">
            BB LaundryLink
          </Link>
          <span>Find. Compare. Book. • Bhubaneswar</span>
          <a href="mailto:support@bblaundrylink.com">Contact support</a>
        </div>
        <p className="landing-sample-note">
          Design preview: partner imagery, prices, distances, and ratings are
          sample content. Booking, pickup, payment, and delivery are not live
          yet.
        </p>
      </footer>
      {selected.length > 0 && (
        <aside
          className="landing-compare-tray d-flex align-items-center gap-3"
          aria-label="Selected partners for comparison"
        >
          <strong role="status">{selected.length} selected</strong>
          <div className="landing-compare-avatars d-flex">
            {compared.map((partner) => (
              <img key={partner.id} src={partner.image} alt={partner.name} />
            ))}
          </div>
          <button
            className="btn bento-orange"
            disabled={selected.length < 2}
            onClick={() =>
              setDialog({ type: "compare", title: "Compare laundry partners" })
            }
          >
            {selected.length < 2 ? "Select one more" : "Compare Now →"}
          </button>
          <button
            className="btn landing-clear-compare"
            aria-label="Clear comparison"
            onClick={() => setSelected([])}
          >
            ×
          </button>
        </aside>
      )}
      {dialog && (
        <Modal
          title={dialog.title}
          wide={dialog.type === "compare"}
          onClose={() => setDialog(null)}
        >
          {dialog.type === "compare" ? (
            <>
              <p className="landing-muted">
                Sample wash & fold prices. Check final service availability
                before live booking.
              </p>
              <div className="table-responsive">
                <table className="table landing-compare-table">
                  <caption>Side-by-side sample partner comparison</caption>
                  <thead>
                    <tr>
                      <th scope="col">Details</th>
                      {compared.map((partner) => (
                        <th scope="col" key={partner.id}>
                          <img src={partner.image} alt="" />
                          {partner.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Wash & Fold",
                        (partner) =>
                          partner.rates["Wash & Fold"]
                            ? `${money(partner.rates["Wash & Fold"])}/kg`
                            : "Not offered",
                      ],
                      ["Sample rating", (partner) => `${partner.rating} / 5`],
                      ["Distance", (partner) => `${partner.distance} km`],
                      [
                        "Sample turnaround",
                        (partner) => `${partner.time} mins`,
                      ],
                      ["Services", (partner) => partner.services.join(", ")],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        {compared.map((partner) => (
                          <td key={partner.id}>{value(partner)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row">Explore</th>
                      {compared.map((partner) => (
                        <td key={partner.id}>
                          <button
                            className="btn bento-blue"
                            onClick={() => book(partner)}
                          >
                            View booking
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <p>{dialog.text}</p>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn bento-blue"
                  onClick={() => setDialog(null)}
                >
                  Got it
                </button>
                <Link
                  className="btn bento-dark"
                  to={user ? "/dashboard" : "/login"}
                >
                  {user ? "Dashboard" : "Sign in"}
                </Link>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
