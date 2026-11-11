# 🍲 Cozy’Plate – Kitchen Vibes

> **Good Food. Great Moments. Cozy’Plate.**  
> A premium, modern, visually appetizing, and fully responsive Nigerian food business website and ordering system designed for **Cozy’Plate – Kitchen Vibes**, located in Abuja, Nigeria.

---

## 🌟 Key Features & Highlights

### 1. Brand Identity & Visual Design
- **Appetizing Color Palette:** Elegant warm cream (`#FDFBF7`, `#F8F4EC`), deep earthy Nigerian brown (`#20120A`, `#2D1A10`), vibrant culinary orange (`#E8590C`), and subtle luxury gold accents (`#D4AF37`).
- **Modern Typography:** Hand-selected pairing of *Playfair Display* for warm, premium culinary headings and *Plus Jakarta Sans* for clean, modern readability.
- **High-Resolution Nigerian Food Photography:** High-res appetizing food photography showcasing smoky party Jollof, Egusi soup, Seafood Okra, Asun, and Northern Suya with fallbacks.
- **Micro-Interactions & Transitions:** Subtle elevation shadows, smooth category switching, responsive card hover effects, and spring-like badge animations without clutter.

### 2. Header & Navigation
- **Top Notice Bar:** Displays live kitchen operating hours, current Abuja location, phone link, and WhatsApp ordering link.
- **Navigation Bar:** Business brand logo, Home, About Us, Our Menu, Why Choose Us, Gallery, Reviews, and Contact Us.
- **Dynamic Cart Badge:** Displays real-time quantity of items in the cart with bounce animation.
- **High-Contrast "Order Now" Button:** Immediate call-to-action that guides customers directly to the menu.
- **Mobile Hamburger Drawer:** Touch-friendly, fully accessible offcanvas mobile navigation.

### 3. Hero Section
- **Compelling Slogan:** *"Good Food. Great Moments. Cozy’Plate."*
- **Supporting Narrative:** *"Experience delicious, freshly prepared meals made with love. Bringing the authentic taste of Nigerian cuisine straight to your table."*
- **Two Working CTAs:** "Order Online" (opens cart drawer) and "Explore Our Menu" (smooth scroll to menu).
- **Floating Trust Badges:** "100% Fresh Daily", "Abuja Fast Delivery", and "4.8 ★ Verified Rating".
- **Quick Stats:** 20+ authentic dishes, 30-45 mins average preparation & dispatch, 1,500+ happy foodies.

### 4. Interactive Menu & Pricing
Organized into the 5 primary categories requested:
1. 🍚 **Rice Bowls** (Smoky Party Jollof Bowl, Signature Fried Rice Bowl, Native Village Rice Bowl, Ofada Rice & Ayamase Bowl, Golden Coconut Rice Bowl).
2. 🍲 **Daily Yum** (Royal Egusi Soup & Pounded Yam, Fisherman Seafood Okra Soup, Efo Riro Elegusi Special, Rich Ogbono Draw Soup, Delta Banga Soup & Starch).
3. 🎉 **Cozy Weekend** (Cozy Platter Feast for 2-3, Weekend Seafood Jollof Mega Box, Sunday Asun & Yam Pottage, Gizdodo Weekend Special).
4. ⭐ **Chef Specials** (Fresh Catfish Pepper Soup "Point & Kill", Slow-Cooked Goat Meat Pepper Soup, Firewood Native Stir-Fry Pasta, Honey Glazed Jumbo Turkey Bowl).
5. 🥩 **Proteins & Sides** (Northern Beef Suya Skewers, Peppered Goat Meat [Asun], Grilled Jumbo Turkey Wing, Crispy Fried Titus Fish, Golden Fried Dodo [Sweet Plantains], Extra Swallow).
- **Dish Cards Feature:** High-res photo, dish name, flavorful description, price in Nigerian Naira (₦), spice level, preparation time, and "Add to Cart" button.
- **Live Search & Filter:** Instant search box to filter meals by keyword or ingredient (e.g. "Jollof", "Egusi", "Turkey", "Pepper").
- **Quick View Modal:** Full dish overview with calories, spice meter, customer reviews, and custom kitchen notes.

### 5. Shopping Cart & Dynamic Calculations
- **Offcanvas Slide-Over Drawer:** Real-time updates without page reloading.
- **Item Controls:** Quantity increment/decrement (+ / -), delete item, item line totals.
- **Dynamic Fee Calculations:** Subtotal, Eco Packaging Pack (₦500), Delivery Fee (₦1,500), Free Delivery calculation (Orders over ₦25,000 unlock Free Delivery), and Grand Total in ₦.
- **Persistent Storage:** Stored in browser `localStorage` so items remain even on refresh.

### 6. Checkout System
- **Single-Page Modal & Dedicated Page (`checkout.html`):** Clean, frictionless checkout.
- **Form Data Collected:** Full Name, Phone Number (Nigerian format), Email Address, Delivery vs. Self-Pickup Preference, Delivery Address & Landmark, Delivery Area, Preferred Delivery Time, and Special Instructions.
- **Itemized Order Summary:** Full review before placement.
- **Form Validation:** Real-time feedback with clean error alerts.

### 7. Gmail Order Notifications (Secure & Reliable)
- **Direct to Gmail:** Orders are routed directly to `cozyplatekitchen@gmail.com`.
- **Unique Order ID:** Generated on submission (e.g. `CP-2026-7842`).
- **Complete Details Sent:** Customer contact, delivery address, time, itemized dish quantities, unit prices, subtotal, delivery fee, and grand total.
- **Security First:** Zero Gmail passwords or private secrets in frontend code. Uses EmailJS public key routing or secure backend environment variables.
- **Error Handling & WhatsApp Fallback:** The system **never** pretends an order succeeded if email delivery fails. If unconfigured or offline, it provides an instant 1-tap **"Send Order via WhatsApp"** button containing the complete receipt pre-formatted for WhatsApp!
- **Detailed Setup Guide:** See `GMAIL_SETUP_GUIDE.md` for 3-minute setup instructions.

### 8. Location, Operating Hours & Contact
- **Physical Address:** A.C Umezulike Street, Abuja Municipal Area Council, Abuja, Nigeria.
- **Phone:** `+234 816 724 3214` (with working `tel:` link).
- **WhatsApp:** `+234 816 724 3214` (with working pre-filled WhatsApp message).
- **Email:** `cozyplatekitchen@gmail.com`.
- **Hours:**
  - Tuesday – Saturday: 12:00 PM – 11:00 PM
  - Sunday: 12:30 PM – 11:00 PM
  - Monday: Closed (Kitchen prep & catering)
- **Embedded Interactive Map:** Centered on Abuja Municipal with a working **"Get Directions"** button.

### 9. Food Gallery & Testimonials
- **Photo Gallery:** Filterable by Rice Bowls, Soups & Swallows, and Grills & Asun with hover overlay and quick order button.
- **Customer Reviews:** 4.8 / 5.0 rating based on 21 verified reviews with genuine customer feedback.

---

## 📁 File Structure

```text
cozy/
├── index.html               # Main single-page website
├── checkout.html            # Dedicated standalone checkout page
├── server.js                # Express backend with Gmail Nodemailer & Resend support
├── package.json             # Node dependencies and scripts
├── .env.example             # Environment variables template
├── GMAIL_SETUP_GUIDE.md     # 3-minute Gmail configuration guide for owner
├── README.md                # Project documentation
├── css/
│   └── style.css            # Custom CSS with brand design tokens, animations, responsive rules
├── js/
│   ├── config.js            # Central business details, contact info, hours, fees, email settings
│   ├── menu-data.js         # Complete Nigerian dishes, prices, descriptions, images, categories
│   ├── cart.js              # Cart state management, localStorage, drawer rendering, calculations
│   ├── checkout.js          # Checkout validations, order generation, email dispatch & WhatsApp fallback
│   └── main.js              # Navigation, category tabs, live search, modals, gallery filters
└── images/                  # Project assets folder
```

---

## 🚀 How to Run the Website

### Method 1: Open Directly (Static HTML/CSS/JS)
1. Double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. The entire website, menu browsing, cart calculations, search, filters, modals, and WhatsApp integration work immediately without needing any server!

### Method 2: Using VS Code Live Server
1. Open the `cozy` folder in VS Code.
2. Right-click `index.html` and choose **"Open with Live Server"**.

### Method 3: Using Node.js Express Backend
1. Open PowerShell or Terminal in the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Visit `http://localhost:3000` in your browser.

---

## ✏️ How to Edit Business Information & Menu

### To update Phone, Address, Operating Hours, or Fees:
Open `js/config.js` and modify:
```javascript
contact: {
  address: "A.C Umezulike Street, Abuja Municipal Area Council, Abuja, Nigeria",
  phone: "+234 816 724 3214",
  whatsapp: "+2348167243214",
  email: "cozyplatekitchen@gmail.com"
}
```

### To update Meals, Prices, or Descriptions:
Open `js/menu-data.js` and edit or add any meal:
```javascript
{
  id: "rb-01",
  name: "Smoky Party Jollof Bowl",
  price: 4500, // Price in Nigerian Naira (₦)
  shortDescription: "Firewood-smoked Nigerian Jollof rice...",
  image: "https://images.unsplash.com/..."
}
```

---

## 🧪 Testing Checklist

- [x] Tested responsive design on Mobile (375px), Tablet (768px), and Desktop (1200px+).
- [x] Tested mobile hamburger navigation open and close on link click.
- [x] Tested all 5 menu categories (Rice Bowls, Daily Yum, Cozy Weekend, Chef Specials, Proteins).
- [x] Tested live search filtering (searching for "Jollof", "Egusi", "Turkey", "Suya").
- [x] Tested adding dishes to cart with instant quantity and subtotal update.
- [x] Tested quantity adjustment (+ and -) and removing items from the cart.
- [x] Tested delivery fee calculation, packaging fee (₦500), and free delivery threshold (₦25,000).
- [x] Tested delivery vs. self-pickup preference toggle (delivery fee becomes ₦0 for pickup).
- [x] Tested form validation on checkout (name, phone, email, and address).
- [x] Tested order number generation (`CP-2026-XXXX`).
- [x] Tested email notification pipeline and error handling with 1-click WhatsApp fallback.
- [x] Tested receipt generation, print modal, and WhatsApp order tracking link.
- [x] Tested Google Map embed and all contact action links (Call Now, WhatsApp Us, Get Directions).
