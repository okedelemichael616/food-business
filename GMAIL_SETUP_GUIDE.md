# Cozy’Plate – Kitchen Vibes: Gmail Order Notifications Setup Guide

This guide explains how to set up the ordering system so that **every customer order is delivered straight to the business owner’s Gmail inbox** (`cozyplatekitchen@gmail.com`).

---

## Overview of How the Order System Works

When a customer places an order on Cozy’Plate:
1. The checkout system compiles all order details (customer name, phone, email, address, preferred delivery time, special cooking instructions).
2. It generates a unique Order ID (e.g. `CP-2026-8942`).
3. An itemized table with meals, quantities, individual prices, subtotal, delivery fee, packaging fee, and total amount is constructed.
4. An email notification is sent to the owner's Gmail inbox.
5. If email transmission succeeds, the customer receives a confirmation receipt on-screen and via email.
6. **Zero Lost Orders Guarantee:** If the email delivery ever encounters an issue (e.g. no internet connection or unconfigured API keys), the system **does not falsely claim success**. Instead, it alerts the customer and offers an **Instant 1-Click WhatsApp Order** button that automatically pre-populates the entire formatted order receipt into WhatsApp ready to send to the Cozy’Plate Kitchen desk!

---

## ⚡ Method 1: EmailJS (Recommended – Takes 3 Minutes, No Server Required)

EmailJS connects your website directly to your Gmail account using a secure Public Key. **Your Gmail password is never exposed.**

### Step 1: Create a Free EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/) and click **Sign Up Free**.

### Step 2: Connect your Gmail Service
1. In the EmailJS dashboard, click on **Email Services** > **Add New Service**.
2. Select **Gmail**.
3. Click **Connect Account** and log in with the owner’s Gmail address (`cozyplatekitchen@gmail.com`).
4. Click **Create Service**.
5. Copy your **Service ID** (e.g. `service_cozyplate`).

### Step 3: Create the Order Email Template
1. Go to **Email Templates** > **Create New Template**.
2. Set the **Subject** line to:
   ```text
   🍲 New Order #{{order_number}} from {{customer_name}} ({{total_amount}})
   ```
3. Set the **Content** (Body) to:
   ```html
   <h2>🍲 New Kitchen Order Received!</h2>
   <p><strong>Order Number:</strong> {{order_number}}</p>
   <p><strong>Date & Time:</strong> {{order_date_time}}</p>
   <hr>
   <h3>Customer Details</h3>
   <p><strong>Name:</strong> {{customer_name}}</p>
   <p><strong>Phone:</strong> {{customer_phone}}</p>
   <p><strong>Email:</strong> {{customer_email}}</p>
   <p><strong>Order Type:</strong> {{delivery_preference}}</p>
   <p><strong>Delivery Address:</strong> {{delivery_address}}</p>
   <p><strong>Preferred Time:</strong> {{delivery_time}}</p>
   <p><strong>Special Instructions:</strong> {{customer_notes}}</p>
   <hr>
   <h3>Ordered Meals</h3>
   <pre>{{items_list}}</pre>
   <hr>
   <p><strong>Subtotal:</strong> {{subtotal}}</p>
   <p><strong>Packaging:</strong> {{packaging_fee}}</p>
   <p><strong>Delivery Fee:</strong> {{delivery_fee}}</p>
   <h3>Grand Total: {{total_amount}}</h3>
   ```
4. In the **Settings** tab of the template, set:
   - **To Email:** `cozyplatekitchen@gmail.com`
   - **From Name:** `Cozy'Plate Online Order`
5. Click **Save** and copy your **Template ID** (e.g. `template_cozy_order`).

### Step 4: Get your Public Key
1. Go to **Account** > **API Keys**.
2. Copy your **Public Key** (e.g. `user_abcdef123456789`).

### Step 5: Update `js/config.js`
Open `js/config.js` in your editor and update the `email` section:
```javascript
email: {
  mode: "emailjs",
  ownerGmail: "cozyplatekitchen@gmail.com",
  emailjs: {
    publicKey: "PASTE_YOUR_PUBLIC_KEY_HERE",
    serviceId: "PASTE_YOUR_SERVICE_ID_HERE",
    templateIdOwner: "PASTE_YOUR_TEMPLATE_ID_HERE",
    templateIdCustomer: "template_optional",
    mockOnPlaceholder: true
  }
}
```

That’s it! Save the file, and your website will now deliver every customer order straight to your Gmail inbox!

---

## 🛠️ Method 2: Node.js Express Backend (Optional Dedicated Server)

If you prefer running a backend server on Render, Railway, Vercel, or VPS with Node.js:

### Step 1: Generate a Google App Password
1. Go to your Google Account: [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Ensure **2-Step Verification** is turned **ON**.
3. Under *2-Step Verification*, scroll down to **App Passwords** (or visit [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4. Create an App Name (e.g. `CozyPlate Website`).
5. Google will generate a 16-character password (e.g. `abcd efgh ijkl mnop`).

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in:
```env
PORT=3000
OWNER_GMAIL=cozyplatekitchen@gmail.com
GMAIL_USER=cozyplatekitchen@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Step 3: Install Dependencies & Start the Server
```bash
npm install
npm start
```
The server will start at `http://localhost:3000`. In `js/config.js`, set `email.backend.enabled = true` to route all orders through this server.

---

## 📱 WhatsApp Order Backup Feature

Every customer order is also formatted for instant dispatch to WhatsApp:
- If a customer prefers ordering on WhatsApp, they can click the **Order on WhatsApp** button in the header, footer, or floating action button.
- If email notification encounters any connectivity trouble, the checkout page automatically offers a 1-tap **"Send Order via WhatsApp"** button containing the complete order details, itemized dishes, delivery address, and total price!
