/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | SECURE ORDER & EMAIL BACKEND SERVER
 * ============================================================================
 * Handles customer order submissions, dispatches formatted email notifications
 * to the business owner's Gmail address, and sends customer confirmations.
 * 
 * Sensitive credentials (such as Gmail App Passwords and API keys) are strictly
 * managed through environment variables and are NEVER exposed to client browsers.
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (e) {
  console.log("nodemailer not yet installed. Run 'npm install' to enable backend SMTP.");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname)));

// Configuration from Environment Variables
const OWNER_GMAIL = process.env.OWNER_GMAIL || "cozyplatekitchen@gmail.com";
const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

/**
 * Health Check Endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Cozy'Plate Backend API",
    ownerEmailConfigured: !!OWNER_GMAIL,
    smtpConfigured: !!(GMAIL_USER && GMAIL_APP_PASSWORD),
    resendConfigured: !!RESEND_API_KEY,
    timestamp: new Date().toISOString()
  });
});

/**
 * Helper: Build HTML Email Template for Kitchen Owner
 */
function buildOwnerEmailHtml(order) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FDFBF7; color: #2D1A10; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EADBCA; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
      .header { background: linear-gradient(135deg, #2D1A10, #E8590C); color: #ffffff; padding: 28px 24px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
      .badge-order { display: inline-block; background: #D4AF37; color: #1F120B; font-weight: bold; padding: 4px 14px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
      .content { padding: 24px; }
      .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .info-grid td { padding: 8px 0; font-size: 14px; vertical-align: top; }
      .info-label { color: #6E5446; font-weight: bold; width: 140px; }
      .items-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      .items-table th { background: #F8F4EC; color: #2D1A10; text-align: left; padding: 10px; font-size: 13px; border-bottom: 2px solid #EADBCA; }
      .items-table td { padding: 10px; border-bottom: 1px solid #F0E8DC; font-size: 14px; }
      .total-row { font-size: 16px; font-weight: bold; color: #E8590C; text-align: right; }
      .notes-box { background: #FFF4ED; border-left: 4px solid #E8590C; padding: 12px 16px; border-radius: 4px; font-size: 14px; margin: 16px 0; }
      .footer { background: #150B06; color: #C4B5A5; text-align: center; padding: 16px; font-size: 12px; }
      .btn-wa { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 10px 20px; border-radius: 25px; margin-top: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🍲 New Kitchen Order Received!</h1>
        <p>Cozy’Plate – Kitchen Vibes Notification</p>
        <span class="badge-order">Order #${order.orderNumber}</span>
      </div>
      <div class="content">
        <p style="font-size: 15px; margin-top: 0;"><strong>A new order was placed by ${order.customerName}.</strong></p>

        <table class="info-grid">
          <tr><td class="info-label">Customer Name:</td><td><strong>${order.customerName}</strong></td></tr>
          <tr><td class="info-label">Phone Number:</td><td><a href="tel:${order.customerPhone}" style="color: #E8590C; font-weight: bold;">${order.customerPhone}</a></td></tr>
          <tr><td class="info-label">Email:</td><td>${order.customerEmail}</td></tr>
          <tr><td class="info-label">Order Type:</td><td><strong style="color: #2D1A10; text-transform: uppercase;">${order.deliveryPreference}</strong></td></tr>
          <tr><td class="info-label">Delivery Address:</td><td>${order.deliveryAddress}</td></tr>
          <tr><td class="info-label">Preferred Time:</td><td>${order.preferredTime || 'As soon as ready'}</td></tr>
          <tr><td class="info-label">Order Time:</td><td>${order.orderDateTime}</td></tr>
        </table>

        ${order.customerNotes ? `
        <div class="notes-box">
          <strong>Special Customer Instructions:</strong><br>
          ${order.customerNotes}
        </div>` : ''}

        <h3 style="font-size: 16px; margin: 20px 0 8px; color: #2D1A10; border-bottom: 1px solid #EADBCA; padding-bottom: 6px;">Ordered Meals</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Meal</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td style="text-align: center;">${item.quantity}x</td>
                <td style="text-align: right;">₦${Number(item.price).toLocaleString('en-NG')}</td>
                <td style="text-align: right; font-weight: bold;">₦${Number(item.price * item.quantity).toLocaleString('en-NG')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; padding-top: 10px; border-top: 1px dashed #EADBCA;">
          <p style="margin: 4px 0; font-size: 14px;">Subtotal: <strong>${order.subtotalFormatted}</strong></p>
          <p style="margin: 4px 0; font-size: 14px;">Packaging Pack: <strong>${order.packagingFeeFormatted}</strong></p>
          <p style="margin: 4px 0; font-size: 14px;">Delivery Fee: <strong>${order.deliveryFeeFormatted}</strong></p>
          <p class="total-row" style="margin: 8px 0 0; font-size: 18px;">Total Order Amount: ${order.grandTotalFormatted}</p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)}!%20Your%20Cozy'Plate%20order%20%23${order.orderNumber}%20is%20now%20being%20prepared." class="btn-wa">
            💬 Message Customer on WhatsApp
          </a>
        </div>
      </div>
      <div class="footer">
        &copy; 2026 Cozy’Plate – Kitchen Vibes • A.C Umezulike Street, Abuja Municipal, Nigeria
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Helper: Build HTML Email Template for Customer Confirmation
 */
function buildCustomerEmailHtml(order) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FDFBF7; color: #2D1A10; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EADBCA; }
      .header { background: #2D1A10; color: #ffffff; padding: 24px; text-align: center; }
      .content { padding: 24px; }
      .total-highlight { font-size: 20px; font-weight: bold; color: #E8590C; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:22px; color: #D4AF37;">Cozy’Plate – Kitchen Vibes</h1>
        <p style="margin:4px 0 0; color:#EADBCA;">We received your order! (#${order.orderNumber})</p>
      </div>
      <div class="content">
        <p>Hello <strong>${order.customerName}</strong>,</p>
        <p>Thank you for choosing Cozy’Plate! Our chefs are preparing your delicious meals right now with the freshest ingredients and real kitchen vibes.</p>
        <div style="background:#FFF4ED; border: 1px solid #FFD8BE; border-radius: 10px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0 0 6px;"><strong>Estimated Dispatch:</strong> 30 – 45 minutes</p>
          <p style="margin: 0 0 6px;"><strong>Preference:</strong> ${order.deliveryPreference}</p>
          <p style="margin: 0;"><strong>Destination:</strong> ${order.deliveryAddress}</p>
        </div>
        <p><strong>Your Meals:</strong><br>${order.items.map(i => `• ${i.quantity}x ${i.name} (₦${Number(i.price * i.quantity).toLocaleString('en-NG')})`).join('<br>')}</p>
        <p class="total-highlight">Total: ${order.grandTotalFormatted}</p>
        <p>If you have any questions or want to track your dispatch rider, contact our kitchen line at <strong>+234 816 724 3214</strong>.</p>
        <p style="margin-top: 24px; font-size: 14px; color: #6E5446;">Warm regards,<br><strong>The Cozy’Plate Kitchen Team</strong></p>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * POST /api/orders
 * Receives customer order and sends dual emails
 */
app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;

    // Validate payload
    if (!order || !order.customerName || !order.customerPhone || !order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data. Please check all required fields."
      });
    }

    const recipientOwner = OWNER_GMAIL;
    const recipientCustomer = order.customerEmail;

    // If Resend API Key is set
    if (RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Cozy'Plate Kitchen <orders@cozyplate.ng>",
          to: [recipientOwner],
          subject: `🍲 New Kitchen Order #${order.orderNumber} - ${order.customerName} (${order.grandTotalFormatted})`,
          html: buildOwnerEmailHtml(order)
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || "Resend email delivery failed.");
      }

      return res.json({
        success: true,
        orderNumber: order.orderNumber,
        provider: "resend",
        message: "Order placed and email sent to kitchen owner successfully."
      });
    }

    // If Nodemailer Gmail SMTP is configured
    if (nodemailer && GMAIL_USER && GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD
        }
      });

      // 1. Send to Business Owner's Gmail
      await transporter.sendMail({
        from: `"Cozy'Plate System" <${GMAIL_USER}>`,
        to: recipientOwner,
        subject: `🍲 New Order #${order.orderNumber} from ${order.customerName} (${order.grandTotalFormatted})`,
        html: buildOwnerEmailHtml(order)
      });

      // 2. Send Customer Confirmation Email (if valid email provided)
      if (recipientCustomer && recipientCustomer.includes("@")) {
        try {
          await transporter.sendMail({
            from: `"Cozy'Plate – Kitchen Vibes" <${GMAIL_USER}>`,
            to: recipientCustomer,
            subject: `Order Confirmed! Cozy'Plate #${order.orderNumber}`,
            html: buildCustomerEmailHtml(order)
          });
        } catch (custErr) {
          console.warn("Customer confirmation email non-fatal error:", custErr);
        }
      }

      return res.json({
        success: true,
        orderNumber: order.orderNumber,
        provider: "gmail-smtp",
        message: "Order notification delivered to kitchen Gmail successfully."
      });
    }

    // If credentials are not configured, do NOT pretend it succeeded!
    return res.status(503).json({
      success: false,
      message: `Email credentials not yet configured in server environment. Please set GMAIL_USER & GMAIL_APP_PASSWORD or RESEND_API_KEY in .env. Customer can use WhatsApp ordering as instant fallback.`
    });

  } catch (error) {
    console.error("Order processing error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while dispatching order email."
    });
  }
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`COZY'PLATE SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}`);
    console.log(`Owner Gmail: ${OWNER_GMAIL}`);
    console.log(`SMTP configured: ${!!(GMAIL_USER && GMAIL_APP_PASSWORD)}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
