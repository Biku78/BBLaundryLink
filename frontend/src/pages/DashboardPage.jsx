import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../components/DashboardIcon";
import { samplePartners as shops } from "../data/samplePartners";
import { sortPartners } from "../utils/sortPartners";
import { logout } from "../features/auth/authSlice";
import { api } from "../services/api";
import "@fontsource/outfit/latin-400.css";
import "@fontsource/outfit/latin-600.css";
import "@fontsource/outfit/latin-700.css";
import "@fontsource/outfit/latin-800.css";
import "@fontsource/outfit/latin-900.css";
import "./DashboardPage.css";


const services = [
  ["home", "All Services", "Explore all options", ""],
  ["wash", "Wash & Fold", "From ₹45/kg", "Wash & Fold"],
  ["iron", "Ironing", "A crisp, fresh finish", "Ironing"],
  ["hanger", "Dry Cleaning", "Premium garment care", "Dry Cleaning"],
  ["truck", "Pickup", "At your doorstep", "Pickup"],
];
const dock = [
  ["home", "Home", "Dashboard"],
  ["calendar", "Bookings", "My Bookings"],
  ["truck", "Track", "Track Order"],
  ["wallet", "Wallet", "My Wallet"],
  ["user", "Profile", "My Profile"],
];
const promotions = [
  [
    "WELCOME10",
    "10% OFF First Order",
    "A little welcome gift for your laundry day.",
    "orange",
  ],
  [
    "FREEPICKUP",
    "Pickup & Delivery",
    "Freshness, without the trip to the shop.",
    "blue",
  ],
  [
    "WASH3GET1",
    "Buy 3kg Get 1kg Free",
    "Sample bundle idea for your next laundry day.",
    "purple",
  ],
];

export default function DashboardPage({ preview = false }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const partnersRef = useRef(null);
  const [section, setSection] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [category, setCategory] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [copied, setCopied] = useState("");
  const [listView, setListView] = useState(false);
  if (!user && !preview) return <Navigate to="/login" replace />;

  const name = user?.Name || user?.name || "Guest";
  const email = user?.Email || user?.email || "Sign in to view your account";
  const filtered = sortPartners(
    shops.filter(
      (shop) =>
        `${shop.name} ${shop.area} ${shop.services.join(" ")}`
          .toLowerCase()
          .includes(submittedSearch.toLowerCase()) &&
        (!category ||
          category === "Pickup" ||
          shop.services.includes(category)),
    ),
    sort,
  );
  function choose(next) {
    setSection(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function findPartners() {
    setSection("Dashboard");
    requestAnimationFrame(() =>
      partnersRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
  }
  function submitSearch(event) {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    findPartners();
  }
  function resetFilters() {
    setCategory("");
    setSearch("");
    setSubmittedSearch("");
  }
  function signOut() {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/login", { replace: true });
  }
  function book(shop) {
    setDialog({
      title: shop.name,
      text: `Sample starting price: ₹${shop.price}/kg. Available services: ${shop.services.join(", ")}. Live booking is not connected yet. No order or charge will be created.`,
    });
  }
  async function copyOffer(code) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
    } catch {
      setDialog({
        title: "Sample promotion code",
        text: `${code} — this is a design sample, not an active redeemable offer. You can select and copy this code manually.`,
      });
    }
  }
  const unavailable = {
    title: "Coming soon",
    text: "This feature is not connected to a live service yet. No payment or account change has been made.",
  };

  return (
    <div className="customer-dash">
      <header className="bento-topbar d-flex align-items-center justify-content-between gap-2">
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
            <small>Find • Compare • Book</small>
          </span>
        </Link>
        <div className="d-flex align-items-center gap-2 bento-header-actions">
          <button
            className="btn bento-city"
            onClick={() =>
              setDialog({
                title: "Your location",
                text: "Currently showing sample laundry partners in Bhubaneswar. More cities will be available when live partner listings are connected.",
              })
            }
          >
            <Icon name="pin" size={18} />
            <span>Bhubaneswar</span>
            <span aria-hidden="true">⌄</span>
          </button>
          <button
            className="btn bento-notifications"
            aria-label="Notifications"
            onClick={() =>
              setDialog({
                title: "Notifications",
                text: "You have no live notifications. Updates will appear here when the booking service is connected.",
              })
            }
          >
            <Icon name="bell" />
          </button>
          <button
            className="btn bento-user"
            onClick={() => choose("My Profile")}
            aria-label={`View profile for ${name}`}
          >
            <span className="bento-avatar">
              {name.slice(0, 1).toUpperCase()}
            </span>
            <strong>{name.split(" ")[0]}</strong>
          </button>
          <button
            className="btn bento-blue bento-top-book"
            onClick={findPartners}
          >
            Book Now <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="bento-main container-fluid px-0"
      >
        <p className="bento-preview-note">
          {preview ? "Dashboard preview" : "Your personal laundry space"} ·
          Listings, tracking, wallet, and offers are sample or unconnected
          features.
        </p>
        {section === "Dashboard" ? (
          <>
            <section className="bento-welcome bento-surface">
              <div className="row g-4 align-items-center">
                <div className="col-xl-8 col-lg-10">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="bento-chip warm">✦ Welcome Back</span>
                    <span className="bento-chip">
                      <Icon name="shield" size={15} />
                      {user ? "Your customer account" : "Guest preview"}
                    </span>
                  </div>
                  <h1>
                    {name}{" "}
                    <span className="bento-spark" aria-hidden="true">
                      ✦
                    </span>
                    <br />
                    <span className="bento-gradient-text">Your Clothes…</span>
                    <br />
                    <em>Our Priority!</em>
                  </h1>
                  <p className="bento-intro">
                    Find the best laundry near you in{" "}
                    <strong>Bhubaneswar.</strong> Clean • Fresh • On Time — care
                    for your clothes, right at your doorstep.
                  </p>
                </div>
                <div className="col-xl-4 d-none d-xl-flex justify-content-center">
                  <div className="bento-hero-art" aria-hidden="true">
                    <Icon name="wash" size={112} />
                    <span className="bento-orbit orbit-one">
                      <Icon name="heart" size={27} />
                    </span>
                    <span className="bento-orbit orbit-two">✦</span>
                    <span className="bento-orbit orbit-three">
                      <Icon name="hanger" size={29} />
                    </span>
                    <small>
                      A fresh start,
                      <br />
                      every day.
                    </small>
                  </div>
                </div>
              </div>
              <form
                className="bento-search d-flex align-items-center gap-2"
                onSubmit={submitSearch}
              >
                <button
                  type="button"
                  className="btn bento-search-city"
                  onClick={() =>
                    setDialog({
                      title: "Your location",
                      text: "Bhubaneswar is the only city shown in this preview.",
                    })
                  }
                >
                  <Icon name="pin" />
                  <span>
                    <small>YOUR LOCATION</small>
                    <strong>Bhubaneswar ⌄</strong>
                  </span>
                </button>
                <label className="d-flex align-items-center gap-2 flex-grow-1">
                  <Icon name="search" />
                  <input
                    className="form-control"
                    aria-label="Search laundry partners"
                    placeholder="Search laundry services…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <button className="btn bento-blue" type="submit">
                  <Icon name="search" size={20} /> Search
                </button>
              </form>
              <div className="bento-highlights d-flex flex-wrap gap-4">
                <div>
                  <Icon name="heart" />
                  <span>
                    <strong>Care in every wash</strong>
                    <small>Your clothes deserve it</small>
                  </span>
                </div>
                <div>
                  <Icon name="pin" />
                  <span>
                    <strong>Local laundry partners</strong>
                    <small>In and around Bhubaneswar</small>
                  </span>
                </div>
                <div>
                  <Icon name="clock" />
                  <span>
                    <strong>More time for you</strong>
                    <small>Convenient pickup options</small>
                  </span>
                </div>
              </div>
            </section>

            <section
              className="bento-photo"
              aria-label="Freshness in every wash"
            >
              <img
                src="/images/bento-hero.webp"
                alt="A customer enjoying freshly cleaned laundry"
              />
              <div className="bento-photo-top d-flex justify-content-between gap-2">
                <span className="bento-chip">✦ Freshness in Every Wash</span>
                <span className="bento-chip">Made for your everyday</span>
              </div>
              <div className="bento-order-peek d-flex align-items-stretch gap-3">
                <div className="bento-glass flex-grow-1">
                  <small>SAMPLE ORDER PREVIEW</small>
                  <strong>BB-DEMO • In Process</strong>
                  <div
                    className="bento-progress"
                    role="img"
                    aria-label="Sample order is in process"
                  >
                    <span />
                  </div>
                  <span>This is a design sample, not a live order.</span>
                </div>
                <button
                  className="btn bento-orange"
                  onClick={() => choose("Track Order")}
                >
                  <Icon name="truck" />
                  <span>Track</span>
                </button>
              </div>
            </section>
            <div className="bento-promise d-flex flex-wrap justify-content-center gap-3 gap-lg-4">
              <span>✦ Care in every wash</span>
              <span>✦ Local laundry partners</span>
              <span>✦ Fresh Clothes, Happier You</span>
              <span>✦ Pickup at your doorstep</span>
            </div>

            <section className="bento-service-section">
              <div className="bento-section-heading d-flex align-items-center justify-content-between gap-3">
                <h2>
                  <span aria-hidden="true">✦</span> What do you need today?
                </h2>
                <button
                  className="btn bento-link"
                  onClick={() => {
                    resetFilters();
                    findPartners();
                  }}
                >
                  View All →
                </button>
              </div>
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                {services.map(([icon, title, subtitle, value]) => (
                  <div className="col" key={title}>
                    <button
                      className={`btn bento-service w-100 h-100 text-start ${category === value ? "selected" : ""}`}
                      aria-pressed={category === value}
                      onClick={() => {
                        setCategory(value);
                        findPartners();
                      }}
                    >
                      <span className="bento-service-symbol">
                        <Icon name={icon} size={26} />
                      </span>
                      <strong>{title}</strong>
                      <small>{subtitle}</small>
                      <span className="bento-service-action">Explore →</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bento-partners bento-surface" ref={partnersRef}>
              <div className="bento-section-heading d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <h2>
                  <span aria-hidden="true">★</span> Nearby Laundry Partners
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <span className="bento-chip green" role="status">
                    {filtered.length} sample{" "}
                    {filtered.length === 1 ? "partner" : "partners"}
                  </span>
                  <button
                    className="btn bento-view"
                    aria-label={
                      listView ? "Switch to grid view" : "Switch to list view"
                    }
                    aria-pressed={listView}
                    onClick={() => setListView(!listView)}
                  >
                    {listView ? "▦" : "☷"}
                  </button>
                </div>
              </div>
              <div className="bento-partner-controls d-flex justify-content-between align-items-center gap-3 flex-wrap">
                <div
                  className="d-flex gap-2 flex-wrap"
                  aria-label="Filter by service"
                >
                  {[
                    ["All", ""],
                    ["Wash & Fold", "Wash & Fold"],
                    ["Ironing", "Ironing"],
                    ["Dry Cleaning", "Dry Cleaning"],
                  ].map(([label, value]) => (
                    <button
                      className={`btn bento-filter ${category === value ? "active" : ""}`}
                      aria-pressed={category === value}
                      onClick={() => setCategory(value)}
                      key={label}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="d-flex align-items-center gap-2 bento-sort">
                  Sort:{" "}
                  <select
                    className="form-select form-select-sm"
                    aria-label="Sort laundry partners"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price">Price: low to high</option>
                    <option value="rating">Highest rated</option>
                  </select>
                </label>
              </div>
              {submittedSearch && (
                <p className="bento-search-summary">
                  Results for “{submittedSearch}”{" "}
                  <button
                    className="btn bento-link"
                    onClick={() => {
                      setSearch("");
                      setSubmittedSearch("");
                    }}
                  >
                    Clear search ×
                  </button>
                </p>
              )}
              <div
                className={`row ${listView ? "row-cols-1" : "row-cols-1 row-cols-md-2"} g-4 bento-shop-grid`}
              >
                {filtered.map((shop) => (
                  <div className="col" key={shop.id}>
                    <article
                      className={`bento-shop h-100 ${listView ? "list-view" : ""}`}
                    >
                      <div className="bento-shop-photo">
                        <img
                          src={shop.image}
                          alt={`${shop.name} sample laundry facility`}
                          loading="lazy"
                        />
                        <span className="bento-shop-rating">
                          ★ <strong>{shop.rating}</strong>
                          <small>Sample rating</small>
                        </span>
                        <button
                          className={`btn bento-favorite ${favorites.includes(shop.id) ? "saved" : ""}`}
                          aria-label={`${favorites.includes(shop.id) ? "Unsave" : "Save"} ${shop.name}`}
                          aria-pressed={favorites.includes(shop.id)}
                          onClick={() =>
                            setFavorites(
                              favorites.includes(shop.id)
                                ? favorites.filter((id) => id !== shop.id)
                                : [...favorites, shop.id],
                            )
                          }
                        >
                          <Icon name="heart" size={20} />
                        </button>
                        <span className="bento-shop-tag">{shop.tag}</span>
                      </div>
                      <div className="bento-shop-body d-flex flex-column">
                        <div className="d-flex justify-content-between gap-2 mb-3">
                          <h3>{shop.name}</h3>
                          <div className="bento-shop-price">
                            ₹{shop.price}
                            <small>/kg</small>
                            <del>₹{shop.old}/kg</del>
                          </div>
                        </div>
                        <p>
                          <Icon name="pin" size={17} />
                          {shop.area}
                        </p>
                        <div className="d-flex gap-3 bento-shop-meta">
                          <span>
                            <Icon name="pin" size={15} />
                            {shop.distance} km
                          </span>
                          <span>
                            <Icon name="clock" size={16} />
                            {shop.time} mins
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt-3 mb-4">
                          {shop.services.map((service) => (
                            <span className="bento-service-tag" key={service}>
                              {service}
                            </span>
                          ))}
                        </div>
                        <div className="mt-auto d-flex align-items-center justify-content-between gap-2">
                          <span className="bento-offer-tag">{shop.offer}</span>
                          <button
                            className="btn bento-dark"
                            onClick={() => book(shop)}
                          >
                            Book Now →
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
                  <p>Try a shop name, neighborhood, or another service.</p>
                  <button className="btn bento-blue" onClick={resetFilters}>
                    Show all partners
                  </button>
                </div>
              )}
            </section>

            <div className="row g-4 bento-account-grid">
              <div className="col-12 col-xl-7">
                <section className="bento-tracking bento-surface h-100">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <h2>
                      <span className="bento-heading-icon">
                        <Icon name="truck" />
                      </span>{" "}
                      Track Your Order
                    </h2>
                    <span className="bento-chip">SAMPLE</span>
                  </div>
                  <p>Order preview • BB-DEMO</p>
                  <ol>
                    {["Picked Up", "In Process", "Ready", "Delivered"].map(
                      (label, i) => (
                        <li key={label} className={i < 2 ? "complete" : ""}>
                          <span>{i === 0 ? "✓" : i + 1}</span>
                          <strong>{label}</strong>
                        </li>
                      ),
                    )}
                  </ol>
                  <button
                    className="btn bento-orange w-100"
                    onClick={() => choose("Track Order")}
                  >
                    Track Now →
                  </button>
                </section>
              </div>
              <div className="col-12 col-xl-5">
                <section className="bento-wallet h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <small>BB WALLET</small>
                    <Icon name="wallet" size={30} />
                  </div>
                  <h2>Coming soon</h2>
                  <p>No live balance or cashback available.</p>
                  <div className="row g-2 mt-auto">
                    <div className="col-6">
                      <button
                        className="btn w-100"
                        onClick={() => setDialog(unavailable)}
                      >
                        + Add Money
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn w-100 secondary"
                        onClick={() => choose("My Wallet")}
                      >
                        History
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <section className="bento-promo">
              <span className="bento-promo-art" aria-hidden="true">
                <Icon name="gift" size={130} />
              </span>
              <small>SAMPLE WELCOME OFFER</small>
              <h2>Get 10% OFF</h2>
              <p>on Your First Booking</p>
              <button
                className="btn bento-code"
                onClick={() => copyOffer("WELCOME10")}
              >
                {copied === "WELCOME10" ? "Copied ✓" : "Use Code: WELCOME10 ⧉"}
              </button>
              <button className="btn bento-orange" onClick={findPartners}>
                Explore Partners →
              </button>
              <small className="bento-promo-disclaimer">
                Design sample only. This code is not currently redeemable.
              </small>
            </section>
            <section className="bento-city-note bento-surface d-flex align-items-center gap-3">
              <span className="bento-heading-icon">
                <Icon name="home" size={30} />
              </span>
              <div>
                <h2>
                  Smart City Bhubaneswar <span aria-hidden="true">♥</span>
                </h2>
                <p>BB LaundryLink • Your Laundry, Our Care</p>
              </div>
              <button
                className="btn bento-link ms-auto"
                aria-label="About our service area"
                onClick={() =>
                  setDialog({
                    title: "Made for Bhubaneswar",
                    text: "Discover sample laundry partners around Patia, IRC Village, Nayapalli, and more. Live partner availability is not connected yet.",
                  })
                }
              >
                →
              </button>
            </section>
            <section className="bento-how bento-surface">
              <h2 className="text-center">
                How it works <span>— 3 Simple Steps</span>
              </h2>
              <div className="row g-3 mt-3">
                {[
                  [
                    "calendar",
                    "Choose your laundry",
                    "Compare local partners and find the care your clothes need.",
                  ],
                  [
                    "truck",
                    "Arrange a pickup",
                    "Doorstep collection will be available with live booking.",
                  ],
                  [
                    "wash",
                    "Enjoy fresh clothes",
                    "Get clean, pressed, and packed clothes when delivery launches.",
                  ],
                ].map(([icon, title, text], i) => (
                  <div className="col-12 col-md-4" key={title}>
                    <div className="bento-step h-100">
                      <span className="bento-step-number">0{i + 1}</span>
                      <span className="bento-heading-icon">
                        <Icon name={icon} size={29} />
                      </span>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="bento-deals">
              <div className="bento-section-heading">
                <h2>
                  <span aria-hidden="true">✦</span> Offers & Deals for You
                </h2>
                <small>Preview ideas — not active promotions</small>
              </div>
              <div className="row g-3">
                {promotions.map(([code, title, text, tone]) => (
                  <div className="col-12 col-md-4" key={code}>
                    <article className={`bento-deal tone-${tone} h-100`}>
                      <h3>{title}</h3>
                      <p>{text}</p>
                      <button className="btn" onClick={() => copyOffer(code)}>
                        {copied === code ? "Copied ✓" : `${code} ⧉`}
                      </button>
                    </article>
                  </div>
                ))}
              </div>
              <p className="bento-copy-status" role="status">
                {copied
                  ? `${copied} copied. This is a sample code, not an active offer.`
                  : ""}
              </p>
            </section>
            <div className="bento-bottom-links d-flex flex-wrap justify-content-center gap-4">
              <Link to="/">Visit homepage</Link>
              <a href="mailto:support@bblaundrylink.com">Contact support</a>
              <button className="btn bento-link" onClick={signOut}>
                {preview && !user ? "Sign in" : "Logout"}
              </button>
            </div>
          </>
        ) : (
          <section className="bento-detail bento-surface">
            <button
              className="btn bento-link"
              onClick={() => choose("Dashboard")}
            >
              ← Back to dashboard
            </button>
            <h1>{section}</h1>
            {section === "My Profile" ? (
              <>
                <div className="bento-profile-avatar">
                  {name.slice(0, 1).toUpperCase()}
                </div>
                <h2>{name}</h2>
                <p>{email}</p>
                <p>
                  Account type: {user?.Role || user?.role || "Preview guest"}
                </p>
                <p className="text-secondary">
                  Profile editing is not connected yet.
                </p>
                <button className="btn bento-dark" onClick={signOut}>
                  {preview && !user ? "Go to Login" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Icon
                  name={
                    section === "My Bookings"
                      ? "calendar"
                      : section === "Track Order"
                        ? "truck"
                        : "wallet"
                  }
                  size={50}
                />
                <h2>
                  {section === "My Bookings"
                    ? "No live bookings to display"
                    : section === "Track Order"
                      ? "Order tracking is not connected yet"
                      : "Your wallet is coming soon"}
                </h2>
                <p>
                  {section === "My Wallet"
                    ? "There is no live wallet balance or transaction history. Adding money is unavailable until the payment service is connected."
                    : "Orders shown on the home screen are design samples. Your own bookings and tracking updates will appear here once the booking API is connected."}
                </p>
                <button className="btn bento-blue" onClick={findPartners}>
                  Explore laundry partners →
                </button>
              </>
            )}
          </section>
        )}
      </main>

      <nav className="bento-dock d-flex" aria-label="Dashboard navigation">
        {dock.map(([icon, label, value]) => (
          <button
            className={`btn ${section === value ? "active" : ""}`}
            aria-current={section === value ? "page" : undefined}
            onClick={() => choose(value)}
            key={value}
          >
            <Icon name={icon} size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {dialog && (
        <div
          className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
          onClick={() => setDialog(null)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={dialog.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="close"
              aria-label="Close dialog"
              onClick={() => setDialog(null)}
            >
              ×
            </button>
            <h2>{dialog.title}</h2>
            <p>{dialog.text}</p>
            <button className="btn bento-blue" onClick={() => setDialog(null)}>
              Got it
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
