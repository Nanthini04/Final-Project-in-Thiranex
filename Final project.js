"use strict";
 
/* =========================================================
   SmartShop - Final project.js
   Features: page navigation (hash router), search, category
   filter, sort, price filter, cart with quantity, coupons,
   wishlist, quick view, checkout, dark mode, saved data.
   ========================================================= */
 
/* ---------- PRODUCT DATA ---------- */
const products = [
  {
    id: 1, name: "Laptop", price: 59999, category: "Electronics", rating: 4.5, reviews: 128, emoji: "💻",
    desc: "Fast everyday laptop with 16 GB RAM and a 512 GB SSD. Great for study and work.",
    image: "https://img.magnific.com/free-photo/laptop-with-sun-background_1232-429.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: 2, name: "Headphones", price: 2999, category: "Accessories", rating: 4.2, reviews: 342, emoji: "🎧",
    desc: "Wireless over-ear headphones with deep bass and up to 30 hours of battery.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_DBvTzWQX9lXu9WeyStG8wkSHWXLq3_Iupw&s"
  },
  {
    id: 3, name: "Smart Watch", price: 4999, category: "Wearables", rating: 4.4, reviews: 215, emoji: "⌚",
    desc: "Tracks steps, heart rate and sleep. Shows call and message alerts on your wrist.",
    image: "https://t4.ftcdn.net/jpg/06/60/68/37/360_F_660683718_qo0q1V2RuLO56S7cu4VMb078m10U6WW8.jpg"
  },
  {
    id: 4, name: "Camera", price: 24999, category: "Electronics", rating: 4.7, reviews: 87, emoji: "📷",
    desc: "24 MP DSLR camera with an 18-55 mm lens. Records full HD video.",
    image: "https://img.magnific.com/free-psd/black-dslr-camera-with-lens_530521-1824.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: 5, name: "Bluetooth Speaker", price: 1999, category: "Electronics", rating: 4.1, reviews: 460, emoji: "🔊",
    desc: "Portable, water-resistant speaker with 12 hours of playtime.",
    image: "https://www.pebblecart.com/cdn/shop/files/0_2e42008b-e585-4b54-a7c2-ddbf07f15b99.jpg?v=1784293586&width=1000"
  },
  {
    id: 6, name: "Fitness Band", price: 1499, category: "Wearables", rating: 4.0, reviews: 390, emoji: "🏃",
    desc: "Lightweight band with step counter, sleep tracking and a 10-day battery.",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MJV04ref_VW_34FR_NCE+watch-case-42-aluminum-lightgold-nc-s12_VW_34FR+watch-face-42-aluminum-lightgold-s12_VW_34FR_GEO_IN?wid=5120&hei=3280&bgc=fafafa&trim=1&fmt=p-jpg&qlt=80&.v=cE1CRWxZQS9ra3gzK201VHhsaEtodTNBUDJrcVJULytKcGloTXUxMUdXREREUGh3TDFOMkx6R2FiaTNvTkpjeWdVVmtGb3FiRk1WYzlRZHE0WXE4d3RGNnlaeXQ4NGFKQTAzc0NGeHR2aWJERFBod0wxTjJMekdhYmkzb05KY3k5RlJXVXp2eHlROXJaelRPa25NdjRMVzNGUmRXcDhodTQwQnRnbmxwWjJLOG8vRzJ1QjU0M083ZlowMjg1N3dhZ2szdjZkUnVjaUUxYlJIUFFySWhUYTB6QjllalFrSjZZZ1VjN3NNR0F0WE1TK3hYSHFqa2Y3L1FFbmcreEwrbA"
  },
  {
    id: 7, name: "Backpack", price: 1299, category: "Accessories", rating: 4.3, reviews: 275, emoji: "🎒",
    desc: "Water-resistant backpack with a padded laptop sleeve and USB charging port.",
    image: "https://rukminim2.flixcart.com/image/1536/1536/xif0q/backpack/e/h/e/18-9-travessary-roll-on-backpack-15-6-laptop-bag-water-resistant-resized-original-imahmszmmufnhbnn.jpeg?q=90"
  },
  {
    id: 8, name: "Power Bank", price: 999, category: "Accessories", rating: 4.6, reviews: 512, emoji: "🔋",
    desc: "20,000 mAh power bank with fast charging and two USB ports.",
    image: "https://ventiontech.com/cdn/shop/files/1000_09cb6003-263c-4369-bc8f-24e13eeb93f1.jpg?v=1787563845&width=600"
  }
];
 
/* ---------- COUPONS ---------- */
const coupons = {
  SMART10: { type: "percent", value: 10, label: "10% off" },
  STUDENT15: { type: "percent", value: 15, label: "15% off" },
  FLAT500: { type: "flat", value: 500, label: "₹500 off" }
};
 
const FREE_SHIPPING_ABOVE = 5000;
const SHIPPING_FEE = 99;
 
/* ---------- SAVED STATE (localStorage) ---------- */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
 
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}
 
const state = {
  cart: load("ss_cart", {}),          // { productId: quantity }
  wishlist: load("ss_wish", []),      // [productId]
  coupon: load("ss_coupon", ""),      // applied coupon code
  theme: load("ss_theme", "light"),
  category: "All",
  sort: "default",
  maxPrice: 60000,
  query: ""
};
 
/* ---------- ELEMENT SHORTCUTS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
 
const productContainer = $("#productContainer");
const featuredContainer = $("#featuredContainer");
const wishlistContainer = $("#wishlistContainer");
const cartContainer = $("#cartContainer");
const searchInput = $("#searchInput");
const resultCount = $("#resultCount");
 
/* ---------- HELPERS ---------- */
const money = (n) => "₹" + n.toLocaleString("en-IN");
const findProduct = (id) => products.find((p) => p.id === Number(id));
 
function fallbackImg(emoji) {
  const e = emoji || "🛍";
  return "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>" +
      "<rect width='100%' height='100%' fill='#e2e8f0'/>" +
      "<text x='50%' y='50%' font-size='120' text-anchor='middle' dominant-baseline='central'>" + e + "</text></svg>"
    );
}
 
function imgTag(p, cls, action) {
  const src = p.image || fallbackImg(p.emoji);
  const act = action ? ` data-action="view" data-id="${p.id}"` : "";
  return `<img class="${cls || ""}" src="${src}" alt="${p.name}" loading="lazy" data-emoji="${p.emoji}"${act}
          onerror="this.onerror=null;this.src=fallbackImg(this.dataset.emoji)">`;
}
 
function stars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
 
function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  $("#toastWrap").appendChild(el);
  setTimeout(() => el.remove(), 2200);
}
 
/* =========================================================
   PRODUCT CARDS
   ========================================================= */
function cardHTML(p) {
  const wished = state.wishlist.includes(p.id);
  return `
    <article class="card">
      <button class="wish" data-action="wish" data-id="${p.id}"
              aria-label="${wished ? "Remove from" : "Add to"} wishlist">${wished ? "❤️" : "🤍"}</button>
      ${imgTag(p, "", true)}
      <h3>${p.name}</h3>
      <p class="cat">${p.category}</p>
      <p class="stars">${stars(p.rating)} <small>${p.rating} (${p.reviews})</small></p>
      <h2 class="price">${money(p.price)}</h2>
      <div class="card-btns">
        <button class="btn btn-ghost" data-action="view" data-id="${p.id}">Quick view</button>
        <button class="btn btn-primary" data-action="add" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`;
}
 
function emptyHTML(message, btnText, href) {
  return `<div class="empty"><p>${message}</p><a class="btn btn-primary" href="${href}">${btnText}</a></div>`;
}
 
/* ---------- Products page (search + category + price + sort) ---------- */
function getFilteredProducts() {
  let list = products.filter((p) =>
    (state.category === "All" || p.category === state.category) &&
    p.price <= state.maxPrice &&
    p.name.toLowerCase().includes(state.query)
  );
 
  switch (state.sort) {
    case "low": list.sort((a, b) => a.price - b.price); break;
    case "high": list.sort((a, b) => b.price - a.price); break;
    case "rating": list.sort((a, b) => b.rating - a.rating); break;
    case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}
 
function renderProducts() {
  const list = getFilteredProducts();
  resultCount.textContent = `Showing ${list.length} of ${products.length} products`;
 
  productContainer.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<div class="empty"><p>No products match your search or filters.</p>
       <button class="btn btn-primary" data-action="reset">Clear filters</button></div>`;
 
  $$("#categoryBar .category").forEach((b) =>
    b.classList.toggle("active", b.dataset.cat === state.category));
}
 
function renderFeatured() {
  const top = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  featuredContainer.innerHTML = top.map(cardHTML).join("");
}
 
function renderWishlist() {
  const list = products.filter((p) => state.wishlist.includes(p.id));
  wishlistContainer.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : emptyHTML("Your wishlist is empty. Tap the heart on any product to save it.", "Browse products", "#products");
}
 
/* =========================================================
   CART
   ========================================================= */
function cartItems() {
  return Object.keys(state.cart)
    .map((id) => ({ product: findProduct(id), qty: state.cart[id] }))
    .filter((i) => i.product);
}
 
function cartTotals() {
  const subtotal = cartItems().reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const c = coupons[state.coupon];
  let discount = 0;
  if (c) discount = c.type === "percent" ? Math.round(subtotal * c.value / 100) : Math.min(c.value, subtotal);
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  return { subtotal, discount, shipping, total: afterDiscount + shipping };
}
 
function renderCart() {
  const items = cartItems();
 
  if (!items.length) {
    cartContainer.innerHTML = emptyHTML("Your cart is empty.", "Start shopping", "#products");
    return;
  }
 
  const t = cartTotals();
  const c = coupons[state.coupon];
 
  const rows = items.map(({ product: p, qty }) => `
    <div class="cart-item">
      ${imgTag(p, "")}
      <div>
        <h4>${p.name}</h4>
        <p class="muted">${p.category} &middot; ${money(p.price)} each</p>
        <div class="qty">
          <button data-action="dec" data-id="${p.id}" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${p.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="line-total">
        ${money(p.price * qty)}
        <button class="remove" data-action="remove" data-id="${p.id}">Remove</button>
      </div>
    </div>`).join("");
 
  cartContainer.innerHTML = `
    <div class="cart-items">
      ${rows}
      <button class="btn btn-danger" data-action="clear" style="align-self:flex-start">Clear cart</button>
    </div>
 
    <aside class="summary">
      <h3>Order summary</h3>
      <form class="coupon" id="couponForm">
        <input type="text" id="couponInput" placeholder="Coupon code" value="${state.coupon}" aria-label="Coupon code">
        <button class="btn btn-ghost" type="submit">Apply</button>
      </form>
      <p class="coupon-msg ${c ? "ok" : ""}" id="couponMsg">${c ? "Coupon " + state.coupon + " applied (" + c.label + ")" : "Try SMART10, STUDENT15 or FLAT500"}</p>
      <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      <div class="row discount"><span>Discount</span><span>− ${money(t.discount)}</span></div>
      <div class="row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : "Free"}</span></div>
      <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
      <button class="btn btn-primary btn-block" data-action="checkout">Checkout</button>
    </aside>`;
}
 
function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  toast(findProduct(id).name + " added to cart");
}
 
function changeQty(id, delta) {
  const next = (state.cart[id] || 0) + delta;
  if (next <= 0) delete state.cart[id];
  else state.cart[id] = next;
  saveCart();
  renderCart();
}
 
function saveCart() {
  save("ss_cart", state.cart);
  updateBadges();
}
 
function toggleWish(id) {
  id = Number(id);
  const i = state.wishlist.indexOf(id);
  if (i === -1) { state.wishlist.push(id); toast("Added to wishlist"); }
  else { state.wishlist.splice(i, 1); toast("Removed from wishlist"); }
  save("ss_wish", state.wishlist);
  updateBadges();
  renderAllLists();
}
 
function updateBadges() {
  const count = Object.values(state.cart).reduce((a, b) => a + b, 0);
  $("#cartCount").textContent = count;
  $("#fabCount").textContent = count;
  $("#wishCount").textContent = state.wishlist.length;
}
 
function renderAllLists() {
  renderProducts();
  renderFeatured();
  renderWishlist();
}
 
/* =========================================================
   MODALS (quick view + checkout)
   ========================================================= */
const modal = $("#modal");
const modalBody = $("#modalBody");
 
function openModal(html) {
  modalBody.innerHTML = `<button class="modal-close" data-action="close" aria-label="Close">×</button>` + html;
  modal.classList.remove("hidden");
}
 
function closeModal() {
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
}
 
function quickView(id) {
  const p = findProduct(id);
  openModal(`
    ${imgTag(p, "qv")}
    <h2>${p.name}</h2>
    <p class="stars" style="color:#f59e0b">${stars(p.rating)} <small style="color:var(--muted)">${p.rating} (${p.reviews} reviews)</small></p>
    <p>${p.desc}</p>
    <h2>${money(p.price)}</h2>
    <button class="btn btn-primary" data-action="add" data-id="${p.id}">Add to cart</button>`);
}
 
function openCheckout() {
  const t = cartTotals();
  openModal(`
    <h2>Checkout</h2>
    <form id="checkoutForm" novalidate>
      <label>Full name <input type="text" id="coName" placeholder="Your name"><small class="error" id="coNameErr"></small></label>
      <label>Phone <input type="tel" id="coPhone" placeholder="10-digit mobile number"><small class="error" id="coPhoneErr"></small></label>
      <label>Delivery address <textarea id="coAddr" rows="3" placeholder="House no, street, city, PIN"></textarea><small class="error" id="coAddrErr"></small></label>
      <label>Payment method
        <select id="coPay">
          <option>Cash on delivery</option>
          <option>UPI</option>
          <option>Credit / Debit card</option>
        </select>
      </label>
      <button class="btn btn-primary btn-block" type="submit">Place order &middot; ${money(t.total)}</button>
    </form>`);
}
 
function showSuccess(name) {
  const orderId = "SS" + Date.now().toString().slice(-7);
  state.cart = {};
  state.coupon = "";
  save("ss_coupon", "");
  saveCart();
  renderCart();
  openModal(`
    <div class="success">
      <div class="tick">✅</div>
      <h2>Order placed!</h2>
      <p>Thank you, ${name}. Your order <strong>${orderId}</strong> is confirmed.</p>
      <a class="btn btn-primary btn-block" href="#products" data-action="close">Continue shopping</a>
    </div>`);
}
 
/* =========================================================
   NAVIGATION (hash router): #home #products #wishlist #cart #contact
   ========================================================= */
const routes = ["home", "products", "wishlist", "cart", "contact"];
 
function router() {
  let route = location.hash.replace("#", "") || "home";
  if (!routes.includes(route)) route = "home";
 
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + route));
  $$(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === route));
 
  if (route === "products") renderProducts();
  if (route === "wishlist") renderWishlist();
  if (route === "cart") renderCart();
 
  document.title = "SmartShop | " + route.charAt(0).toUpperCase() + route.slice(1);
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}
 
window.addEventListener("hashchange", router);
 
/* =========================================================
   EVENTS (one click handler for all buttons)
   ========================================================= */
document.addEventListener("click", (e) => {
  // Category tiles on the home page
  const tile = e.target.closest(".tile");
  if (tile) { state.category = tile.dataset.cat; renderProducts(); return; }
 
  // Category pills on the products page
  const pill = e.target.closest("#categoryBar .category");
  if (pill) { state.category = pill.dataset.cat; renderProducts(); return; }
 
  // Click on the dark backdrop closes the modal
  if (e.target === modal) { closeModal(); return; }
 
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const id = el.dataset.id;
 
  switch (el.dataset.action) {
    case "add": addToCart(id); break;
    case "view": quickView(id); break;
    case "wish": toggleWish(id); break;
    case "inc": changeQty(id, 1); break;
    case "dec": changeQty(id, -1); break;
    case "remove": changeQty(id, -(state.cart[id] || 0)); break;
    case "clear":
      state.cart = {}; saveCart(); renderCart(); toast("Cart cleared"); break;
    case "checkout": openCheckout(); break;
    case "close": closeModal(); break;
    case "reset":
      state.category = "All"; state.query = ""; state.sort = "default"; state.maxPrice = 60000;
      searchInput.value = ""; $("#sortSelect").value = "default"; $("#priceRange").value = 60000;
      $("#priceLabel").textContent = money(60000);
      renderProducts();
      break;
  }
});
 
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
 
/* ---------- Form submits (coupon, checkout, contact) ---------- */
document.addEventListener("submit", (e) => {
  e.preventDefault();
 
  if (e.target.id === "couponForm") {
    const code = $("#couponInput").value.trim().toUpperCase();
    if (coupons[code]) {
      state.coupon = code;
      save("ss_coupon", code);
      renderCart();
      toast("Coupon applied");
    } else {
      const msg = $("#couponMsg");
      msg.textContent = "Invalid coupon code.";
      msg.className = "coupon-msg bad";
    }
  }
 
  if (e.target.id === "checkoutForm") {
    const name = $("#coName").value.trim();
    const phone = $("#coPhone").value.trim();
    const addr = $("#coAddr").value.trim();
    $("#coNameErr").textContent = name.length < 2 ? "Enter your full name." : "";
    $("#coPhoneErr").textContent = /^[6-9]\d{9}$/.test(phone) ? "" : "Enter a valid 10-digit mobile number.";
    $("#coAddrErr").textContent = addr.length < 8 ? "Enter your full delivery address." : "";
    if (name.length >= 2 && /^[6-9]\d{9}$/.test(phone) && addr.length >= 8) showSuccess(name);
  }
 
  if (e.target.id === "contactForm") {
    const name = $("#cName").value.trim();
    const email = $("#cEmail").value.trim();
    const msg = $("#cMsg").value.trim();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    $("#cNameErr").textContent = name ? "" : "Please enter your name.";
    $("#cEmailErr").textContent = okEmail ? "" : "Please enter a valid email.";
    $("#cMsgErr").textContent = msg.length >= 10 ? "" : "Message must be at least 10 characters.";
    if (name && okEmail && msg.length >= 10) {
      e.target.reset();
      toast("Message sent. We will reply soon.");
    }
  }
});
 
/* ---------- Search, sort, price ---------- */
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim().toLowerCase();
  if (location.hash !== "#products") location.hash = "#products";
  else renderProducts();
});
 
$("#sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});
 
$("#priceRange").addEventListener("input", (e) => {
  state.maxPrice = Number(e.target.value);
  $("#priceLabel").textContent = money(state.maxPrice);
  renderProducts();
});
 
/* ---------- Dark mode (remembered) ---------- */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  $("#darkMode").textContent = state.theme === "dark" ? "☀️" : "🌙";
}
 
$("#darkMode").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  save("ss_theme", state.theme);
  applyTheme();
});
 
/* ---------- Mobile menu ---------- */
$("#menuToggle").addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});
 
/* =========================================================
   START
   ========================================================= */
$("#year").textContent = new Date().getFullYear();
applyTheme();
updateBadges();
renderAllLists();
router();