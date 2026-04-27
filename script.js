const shipping = 60;
const tax = 0;

let cart = [];
let url = "https://pureix.netlify.app/";
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbx5TaoMMBiMwaOw8Yr-UGFrqvcJ0hDOJsUcdxRr3Hw3RsMPYz8Oes670jTyTdzvrBgsgQ/exec"; // ← paste your URL here

let products = [
  {
    img: "https://pureix.netlify.app/images/glycerin-soap.png",
    title: "Glycerin Soap",
    description: "Hydrate and glow with our gentle glycerin soap, formulated with natural ingredients to cleanse your skin without dryness. It locks in moisture, keeping your skin soft, smooth, and beautifully radiant. Perfect for everyday use and suitable for all skin types.",
    bestSeller: true,
    new: true,
    price: 180,j
  },
  {
    img: "https://pureix.netlify.app/images/glycerin-soap-with-charcoal-oatmeal.png",
    title: "Glycerin Soap with Charcoal & Oatmeal",
    description: "Purify and refresh your skin with this powerful blend of activated charcoal and natural oatmeal. Designed to deeply cleanse pores, control excess oil, and gently exfoliate without irritation—leaving your skin smooth, clear, and perfectly balanced. Ideal for oily and combination skin.",
    bestSeller: false,
    new: true,
    price: 200,
  },
]


/* =============================================
   NATURAL SOAP — script.js
   =============================================
   Sections:
   1. EmailJS Configuration  ← PUT YOUR KEYS HERE
   2. Navbar scroll effect
   3. Mobile navigation
   4. Scroll animations (IntersectionObserver)
   5. Hero layout (flex row)
   6. Order form — validation + EmailJS submit
   7. Prefill order product from product cards
   ============================================= */


/* ====================================================
   1. EMAIL JS CONFIGURATION
   ====================================================
   Steps to set up EmailJS (free, no backend needed):

   a) Go to https://www.emailjs.com/ and create a FREE account
   b) Add an Email Service (Gmail, Outlook, etc.) → copy the SERVICE ID
   c) Create an Email Template — use these variables in your template:
        {{from_name}}   — customer's name
        {{from_email}}  — customer's email
        {{phone}}       — customer's phone
        {{product}}     — selected product
        {{quantity}}    — quantity ordered
        {{notes}}       — special notes
        {{to_email}}    — your email (example@email.com)
      → Copy the TEMPLATE ID
   d) Go to Account → API Keys → copy your PUBLIC KEY

   Then replace the placeholder values below:
   ==================================================== */
const EMAILJS_SERVICE_ID = "service_9jpfr0l";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_6183408";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY = "t1RCDrEBbOGH6sNU9";   // e.g. "aBcDeFgHiJkLmNoP"

// Your receiving email — matches the {{to_email}} variable in your template
const STORE_EMAIL = "shaimaassad6@email.com";

// Initialize EmailJS with your public key
(function () {
  // emailjs is loaded from CDN in index.html
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();


/* ====================================================
   2. NAVBAR — scroll effect
   ==================================================== */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/* ====================================================
   3. MOBILE NAVIGATION
   ==================================================== */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const closeNav = document.getElementById("closeNav");
const navOverlay = document.getElementById("navOverlay");
const mobLinks = document.querySelectorAll(".mob-link");

function openMobileNav() {
  mobileNav.classList.add("open");
  navOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  mobileNav.classList.remove("open");
  navOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", openMobileNav);
closeNav.addEventListener("click", closeMobileNav);
navOverlay.addEventListener("click", closeMobileNav);

// Close when a link is tapped
mobLinks.forEach(link => {
  link.addEventListener("click", closeMobileNav);
});


/* ====================================================
   4. SCROLL ANIMATIONS — IntersectionObserver
   ==================================================== */
const animatedEls = document.querySelectorAll(
  ".fade-up, .fade-in-left, .fade-in-right"
);

const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -40px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      // Unobserve after triggering so it only plays once
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedEls.forEach(el => observer.observe(el));


/* ====================================================
   5. HERO LAYOUT — ensure flex-row on desktop
      (The hero needs both columns; this builds the
       flex wrapper around hero-content + hero-image)
   ==================================================== */
(function setupHeroLayout() {
  const hero = document.querySelector(".hero");
  const content = document.querySelector(".hero-content");
  const imgWrap = document.querySelector(".hero-image-wrap");

  if (!hero || !content || !imgWrap) return;

  // Wrap them in a flex row container
  const wrap = document.createElement("div");
  wrap.style.cssText = [
    "display:flex",
    "align-items:center",
    "justify-content:space-between",
    "gap:60px",
    "max-width:1140px",
    "width:100%",
    "margin:0 auto",
    "position:relative",
    "z-index:1"
  ].join(";");

  hero.insertBefore(wrap, content);
  wrap.appendChild(content);
  wrap.appendChild(imgWrap);

  // On mobile, collapse to column
  function adjustHero() {
    if (window.innerWidth <= 1024) {
      wrap.style.flexDirection = "column";
      wrap.style.textAlign = "center";
      content.style.maxWidth = "100%";
    } else {
      wrap.style.flexDirection = "row";
      wrap.style.textAlign = "left";
      content.style.maxWidth = "580px";
    }
  }

  adjustHero();
  window.addEventListener("resize", adjustHero);
})();


/* ====================================================
   6. ORDER FORM — validation + EmailJS submit
   ==================================================== */
const orderForm = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btn-text");
const btnSpinner = document.getElementById("btn-spinner");
const formSuccess = document.getElementById("formSuccess");
const formError = document.getElementById("formError");

// Simple field validation
function validateForm() {
  const requiredFields = orderForm.querySelectorAll("[required]");
  let valid = true;

  requiredFields.forEach(field => {
    field.classList.remove("error");

    const val = field.value.trim();
    if (!val) {
      field.classList.add("error");
      valid = false;
      return;
    }

    // Email format check
    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        field.classList.add("error");
        valid = false;
      }
    }

    // Phone: must have at least 6 digits
    if (field.type === "tel") {
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.length < 6) {
        field.classList.add("error");
        valid = false;
      }
    }
  });

  return valid;
}

// Remove error styling on input
orderForm.querySelectorAll("input, select").forEach(field => {
  field.addEventListener("input", () => field.classList.remove("error"));
  field.addEventListener("change", () => field.classList.remove("error"));
});

// Form submit handler
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Hide previous messages
  formError.classList.remove("visible");

  // Validate
  if (!validateForm()) {
    shakeForm();
    return;
  }

  // Check if EmailJS keys have been configured
  if (
    EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
    EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
    EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
  ) {
    showDemoSuccess();
    return;
  }

  // Loading state
  setLoading(true);

  let totalPrice = Number(document.getElementById("total").textContent) + shipping + tax;

  // Build template parameters for EmailJS
  const templateParams = {
    from_name: document.getElementById("f-name").value.trim(),
    email: document.getElementById("f-email").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    address: document.getElementById("f-address").value.trim(),
    cost: {
      shipping: shipping,
      tax: 0,
      total: totalPrice,
    },
    products: cart,
    notes: document.getElementById("f-notes").value.trim() || "",
    to_email: STORE_EMAIL
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    // 2. Log order to Google Sheets
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_name: templateParams.from_name,
        email:     templateParams.email,
        phone:     templateParams.phone,
        address:   templateParams.address,
        products:  templateParams.products,        // full cart array
        shipping:  templateParams.cost.shipping,
        total:     templateParams.cost.total,
        notes:     templateParams.notes
      })
    });


    setLoading(false);
    showSuccess();
  } catch (err) {
    setLoading(false);
    showError();
  }
});

function setLoading(state) {
  submitBtn.disabled = state;
  btnText.style.display = state ? "none" : "inline";
  btnSpinner.style.display = state ? "inline" : "none";
}

function showSuccess() {
  orderForm.style.display = "none";
  formSuccess.classList.add("visible");
}

function showDemoSuccess() {
  // Demo mode — keys not configured yet
  orderForm.style.display = "none";
  formSuccess.classList.add("visible");
  // Add a note to the success screen
  const note = document.createElement("p");
  note.style.cssText = "font-size:.8rem;color:#a09080;margin-top:-10px;margin-bottom:14px;";
  note.textContent = "(Demo mode — EmailJS keys not configured yet. Order was NOT emailed.)";
  const successIcon = formSuccess.querySelector("h3");
  successIcon.insertAdjacentElement("afterend", note);
}

function showError() {
  formError.classList.add("visible");
}

function shakeForm() {
  const wrap = document.querySelector(".order-form-wrap");
  wrap.style.animation = "none";
  wrap.offsetHeight; // reflow
  wrap.style.animation = "shake .4s ease";
}

// Shake animation injected via JS so we don't need it in CSS
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(shakeStyle);

/* ====================================================
   7. PREFILL product from "Order Now" buttons
   ==================================================== */
function prefillOrder(productName) {
  // Scroll to order form
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });

  // After scroll, set the matching select option
  setTimeout(() => {
    const select = document.getElementById("f-product");
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(productName)) {
        select.selectedIndex = i;
        break;
      }
    }
    // Highlight the select briefly
    select.style.borderColor = "#7a9e72";
    select.style.boxShadow = "0 0 0 3px rgba(122,158,114,.2)";
    setTimeout(() => {
      select.style.borderColor = "";
      select.style.boxShadow = "";
    }, 1800);
  }, 750);
}

/* Reset form after success */
function resetForm() {
  orderForm.reset();
  resetCart();
  orderForm.style.display = "";
  formSuccess.classList.remove("visible");
  formError.classList.remove("visible");


  // Remove any injected demo note
  const demoNote = formSuccess.querySelector("p[style]");
  if (demoNote) demoNote.remove();
}

/* ====================================================
   Smooth active-link highlighting in navbar
   ==================================================== */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === "#" + entry.target.id) {
          a.classList.add("active");
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Active link style
const activeStyle = document.createElement("style");
activeStyle.textContent = `.nav-links a.active { color: var(--sage) !important; }`;
document.head.appendChild(activeStyle);


// -------------------------------------------------------------------------------------------------------------------------------------

function resetCart() {
  cart = [];
  renderCart()
}

function addToCart(img, name, price) {
  // Scroll to order form
  document.getElementById("order-form").scrollIntoView({ behavior: "smooth" });

  let item = cart.find(p => p.name === name);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ img, name, price, qty: 1 });
  }

  saveCart();
  renderCart();
}

function removeItem(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

function changeQty(name, qty) {
  let item = cart.find(p => p.name === name);
  if (item) {
    item.qty = parseInt(qty);
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartDiv = document.getElementById("cart");
  const orderContainer = document.getElementById("order-container");
  const emptyCartContainer = document.getElementById("empty-cart");

  orderContainer.classList.toggle("hidden", cart.length === 0);
  emptyCartContainer.classList.toggle("hidden", cart.length !== 0);


  cartDiv.innerHTML = "";

  let total = shipping + tax;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartDiv.innerHTML += `
            <div class="cart-item">
                <div class="form-group">
                    <div class="form-row-4">
                        <img style="width: 70px" src="${item.img}"/>
                        <label for="f-product-${item.name}">${item.name} - ${item.price} EGP</label>
                        <input id="f-product-${item.name}" name="product" type="number" min="1" value="${item.qty}" onchange="changeQty('${item.name}', this.value)" />
                        
                        <button class="btn-remove" onclick="removeItem('${item.name}')">❌</button>
                    </div>
                </div>
            </div>
        `;
  });

  document.getElementById("total").innerText = total;
}


renderCart();


function renderProducts() {
  const productsContainer = document.getElementById("products-Container");

  const html = products.map((product, index) => `
    <div class="product-card">
      <div class="product-image-wrap">
        <img class="product-img" src="${product.img}" alt="${product.title}" />
        ${product.new ? '<div class="product-badge new-badge">New</div>' : '<div class="product-badge">Bestseller</div>'}
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${product.price} EGP</span>
          <button class="btn-order" onclick="addToCart('${product.img}', '${product.title}', '${product.price}')">Order Now</button>
        </div>
      </div>
    </div>
  `).join("");

  productsContainer.innerHTML = html;
}

renderProducts();
