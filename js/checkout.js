/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | CHECKOUT & EMAIL ORDER NOTIFICATION SYSTEM
 * ============================================================================
 * Handles customer checkout data collection, order number generation,
 * field validations, itemized calculations, and secure dispatch to the business
 * owner's Gmail inbox via EmailJS / Backend API, with zero secret exposure.
 * ============================================================================
 */

const CheckoutSystem = {
  isSubmitting: false,

  init() {
    this.bindEvents();
    this.renderOrderSummary();
    this.initEmailJS();
  },

  initEmailJS() {
    // If EmailJS is loaded in window, initialize with public key if available
    try {
      if (typeof emailjs !== "undefined" && CozyConfig.email?.emailjs?.publicKey && CozyConfig.email.emailjs.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
        emailjs.init(CozyConfig.email.emailjs.publicKey);
        console.log("EmailJS initialized with configured Public Key");
      }
    } catch (err) {
      console.warn("EmailJS init note:", err);
    }
  },

  generateOrderNumber() {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `CP-${year}-${randomHex}`;
  },

  formatOrderDateTime() {
    const now = new Date();
    return now.toLocaleString("en-NG", {
      dateStyle: "full",
      timeStyle: "short",
      hour12: true
    });
  },

  bindEvents() {
    // Toggle delivery vs pickup fields
    const deliveryRadio = document.getElementById("prefDelivery");
    const pickupRadio = document.getElementById("prefPickup");
    const addressWrapper = document.getElementById("checkoutAddressWrapper");
    const addressInput = document.getElementById("customerAddress");

    if (deliveryRadio && pickupRadio) {
      deliveryRadio.addEventListener("change", () => {
        Cart.setDeliveryPreference("delivery");
        if (addressWrapper) addressWrapper.classList.remove("d-none");
        if (addressInput) addressInput.setAttribute("required", "required");
        this.renderOrderSummary();
      });

      pickupRadio.addEventListener("change", () => {
        Cart.setDeliveryPreference("pickup");
        if (addressWrapper) addressWrapper.classList.add("d-none");
        if (addressInput) addressInput.removeAttribute("required");
        this.renderOrderSummary();
      });
    }

    // Checkout form submission
    const form = document.getElementById("cozyCheckoutForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit(form);
      });
    }

    // Listen for cart changes to refresh summary
    window.addEventListener("cozyCartUpdated", () => {
      this.renderOrderSummary();
    });
  },

  renderOrderSummary() {
    const summaryContainer = document.getElementById("checkoutOrderSummaryList");
    const subtotalEl = document.getElementById("checkoutSubtotal");
    const deliveryEl = document.getElementById("checkoutDeliveryFee");
    const packagingEl = document.getElementById("checkoutPackagingFee");
    const totalEl = document.getElementById("checkoutGrandTotal");
    const checkoutItemCountEl = document.getElementById("checkoutItemCount");

    const items = Cart.getItems();
    const currency = CozyConfig.ordering?.currencySymbol || "₦";

    if (checkoutItemCountEl) {
      checkoutItemCountEl.textContent = `${Cart.getItemCount()} ${Cart.getItemCount() === 1 ? "item" : "items"}`;
    }

    if (summaryContainer) {
      if (items.length === 0) {
        summaryContainer.innerHTML = `
          <div class="text-center py-4 text-muted">
            <i class="bi bi-basket3 display-6 d-block mb-2 text-warning"></i>
            <p class="mb-2">Your cart is empty.</p>
            <a href="index.html#menu" class="btn btn-sm btn-outline-primary rounded-pill px-3">Browse Menu</a>
          </div>
        `;
      } else {
        summaryContainer.innerHTML = items.map(item => `
          <div class="d-flex align-items-center justify-content-between py-2 border-bottom border-light-subtle">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-secondary-subtle text-dark border px-2 py-1">${item.quantity}x</span>
              <div>
                <h6 class="mb-0 small fw-bold text-truncate" style="max-width: 200px;">${item.name}</h6>
                <span class="text-muted" style="font-size: 0.78rem;">${currency}${Number(item.price).toLocaleString("en-NG")} each</span>
              </div>
            </div>
            <span class="fw-semibold small text-primary">
              ${currency}${Number(item.price * item.quantity).toLocaleString("en-NG")}
            </span>
          </div>
        `).join("");
      }
    }

    const subtotal = Cart.getSubtotal();
    const delivery = Cart.getDeliveryFee();
    const packaging = Cart.getPackagingFee();
    const grandTotal = Cart.getTotal();

    if (subtotalEl) subtotalEl.textContent = `${currency}${subtotal.toLocaleString("en-NG")}`;
    if (deliveryEl) {
      if (Cart.deliveryPreference === "pickup") {
        deliveryEl.innerHTML = `<span class="badge bg-secondary-subtle text-muted">Pickup (₦0)</span>`;
      } else if (delivery === 0) {
        deliveryEl.innerHTML = `<span class="badge bg-success text-white">FREE</span>`;
      } else {
        deliveryEl.textContent = `${currency}${delivery.toLocaleString("en-NG")}`;
      }
    }
    if (packagingEl) packagingEl.textContent = `${currency}${packaging.toLocaleString("en-NG")}`;
    if (totalEl) totalEl.textContent = `${currency}${grandTotal.toLocaleString("en-NG")}`;
  },

  validateForm(formData) {
    const errors = [];

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.push("Please enter your full name (at least 3 characters).");
    }

    const phoneClean = formData.phone ? formData.phone.replace(/[\s\-\(\)]/g, "") : "";
    if (!phoneClean || phoneClean.length < 10) {
      errors.push("Please provide a valid Nigerian phone number (e.g. 0816 724 3214 or +234...).");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      errors.push("Please provide a valid email address to receive order updates.");
    }

    if (formData.deliveryPreference === "delivery") {
      if (!formData.address || formData.address.trim().length < 8) {
        errors.push("Please provide a complete delivery address including street and landmark.");
      }
    }

    if (Cart.getItems().length === 0) {
      errors.push("Your cart is empty! Please add some delicious meals from the menu first.");
    }

    return errors;
  },

  async handleCheckoutSubmit(form) {
    if (this.isSubmitting) return;

    // Collect field values
    const fullName = document.getElementById("customerName")?.value.trim() || "";
    const phone = document.getElementById("customerPhone")?.value.trim() || "";
    const email = document.getElementById("customerEmail")?.value.trim() || "";
    const deliveryPreference = document.querySelector('input[name="deliveryPref"]:checked')?.value || "delivery";
    const address = document.getElementById("customerAddress")?.value.trim() || "";
    const area = document.getElementById("customerArea")?.value || "Abuja Municipal";
    const deliveryTime = document.getElementById("customerDeliveryTime")?.value || "As soon as ready (30-45 mins)";
    const instructions = document.getElementById("customerNotes")?.value.trim() || "No extra instructions";

    const payload = {
      fullName,
      phone,
      email,
      deliveryPreference,
      address: deliveryPreference === "pickup" ? "Self Pickup from Cozy'Plate Kitchen (A.C Umezulike St, Abuja)" : `${address} (${area})`,
      deliveryTime,
      instructions
    };

    // Form validation
    const validationErrors = this.validateForm(payload);
    const errorAlertEl = document.getElementById("checkoutErrorMessage");
    
    if (validationErrors.length > 0) {
      if (errorAlertEl) {
        errorAlertEl.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Please check the following:</strong>
            <ul class="mb-0 mt-2 ps-3">
              ${validationErrors.map(err => `<li>${err}</li>`).join("")}
            </ul>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        errorAlertEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        alert(validationErrors.join("\n"));
      }
      return;
    }

    if (errorAlertEl) errorAlertEl.innerHTML = "";

    // Generate Order Details
    const orderNumber = this.generateOrderNumber();
    const orderDateTime = this.formatOrderDateTime();
    const items = Cart.getItems();
    const currency = CozyConfig.ordering?.currencySymbol || "₦";
    const subtotal = Cart.getSubtotal();
    const deliveryFee = Cart.getDeliveryFee();
    const packagingFee = Cart.getPackagingFee();
    const grandTotal = Cart.getTotal();

    // Create itemized summary string for plain text & email templates
    const itemsFormattedText = items.map(item => 
      `• ${item.quantity}x ${item.name} (${currency}${item.price.toLocaleString("en-NG")} each) = ${currency}${(item.quantity * item.price).toLocaleString("en-NG")}`
    ).join("\n");

    const completeOrderData = {
      orderNumber,
      orderDateTime,
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      deliveryPreference: deliveryPreference.toUpperCase(),
      deliveryAddress: payload.address,
      preferredTime: deliveryTime,
      customerNotes: instructions,
      items: items,
      itemsSummary: itemsFormattedText,
      subtotalFormatted: `${currency}${subtotal.toLocaleString("en-NG")}`,
      deliveryFeeFormatted: deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee.toLocaleString("en-NG")}`,
      packagingFeeFormatted: `${currency}${packagingFee.toLocaleString("en-NG")}`,
      grandTotalFormatted: `${currency}${grandTotal.toLocaleString("en-NG")}`,
      grandTotalRaw: grandTotal,
      ownerGmail: CozyConfig.email?.ownerGmail || "cozyplatekitchen@gmail.com"
    };

    // UI Loading state
    this.setSubmittingState(true);

    try {
      // Send Order via Email
      const emailResult = await this.sendOrderNotification(completeOrderData);

      if (emailResult.success) {
        // Successful Order Processing
        this.onOrderSuccess(completeOrderData);
      } else {
        // Failed to send email: We do NOT pretend it succeeded!
        this.onOrderFailed(emailResult.error, completeOrderData);
      }
    } catch (err) {
      console.error("Order dispatch error:", err);
      this.onOrderFailed(err.message || "Network communication failed", completeOrderData);
    } finally {
      this.setSubmittingState(false);
    }
  },

  async sendOrderNotification(orderData) {
    const config = CozyConfig.email;
    const emailjsCfg = config?.emailjs;

    // Check if backend API is enabled
    if (config?.backend?.enabled && config.backend.endpoint) {
      try {
        const response = await fetch(config.backend.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
        const json = await response.json();
        if (response.ok && json.success) {
          return { success: true, method: "backend" };
        } else {
          return { success: false, error: json.message || "Backend email server error" };
        }
      } catch (backendErr) {
        console.warn("Backend order submission failed, falling back to EmailJS:", backendErr);
      }
    }

    // EmailJS Delivery Mode
    if (typeof emailjs !== "undefined" && emailjsCfg) {
      const isConfigured = emailjsCfg.publicKey && 
                           emailjsCfg.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY" &&
                           emailjsCfg.serviceId !== "service_cozyplate";

      if (isConfigured) {
        try {
          // Template parameters matching EmailJS template placeholders
          const templateParams = {
            order_number: orderData.orderNumber,
            order_date_time: orderData.orderDateTime,
            to_email: config.ownerGmail,
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            customer_email: orderData.customerEmail,
            delivery_preference: orderData.deliveryPreference,
            delivery_address: orderData.deliveryAddress,
            delivery_time: orderData.preferredTime,
            customer_notes: orderData.customerNotes,
            items_list: orderData.itemsSummary,
            subtotal: orderData.subtotalFormatted,
            delivery_fee: orderData.deliveryFeeFormatted,
            packaging_fee: orderData.packagingFeeFormatted,
            total_amount: orderData.grandTotalFormatted
          };

          // Send to Business Owner's Gmail
          await emailjs.send(emailjsCfg.serviceId, emailjsCfg.templateIdOwner, templateParams);

          // Optionally send customer confirmation if template exists
          if (emailjsCfg.templateIdCustomer && emailjsCfg.templateIdCustomer !== "template_cozy_customer") {
            try {
              await emailjs.send(emailjsCfg.serviceId, emailjsCfg.templateIdCustomer, {
                ...templateParams,
                to_email: orderData.customerEmail
              });
            } catch (custErr) {
              console.warn("Customer confirmation email non-fatal error:", custErr);
            }
          }

          return { success: true, method: "emailjs" };
        } catch (emailjsError) {
          console.error("EmailJS dispatch failed:", emailjsError);
          return { 
            success: false, 
            error: emailjsError?.text || emailjsError?.message || "EmailJS server rejected the order dispatch." 
          };
        }
      } else {
        // Notice: The owner hasn't placed their real EmailJS keys yet.
        // As per requirements: "Do not pretend an order was successfully submitted if the email service fails."
        // We provide a dedicated friendly message explaining that EmailJS keys need to be inserted in config.js
        // AND provide an instant 1-click WhatsApp order backup button!
        console.warn("EmailJS credentials are still set to defaults.");
        return {
          success: false,
          isKeyMissing: true,
          error: "Email notification service is pending API Key setup in js/config.js. (Owner's inbox: " + config.ownerGmail + ")"
        };
      }
    }

    return {
      success: false,
      error: "EmailJS SDK is not available or email service is disabled."
    };
  },

  setSubmittingState(isSubmitting) {
    this.isSubmitting = isSubmitting;
    const submitBtn = document.getElementById("btnPlaceOrder");
    if (!submitBtn) return;

    if (isSubmitting) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending Order to Kitchen...
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <i class="bi bi-shield-check me-2"></i> Place Order Now
      `;
    }
  },

  onOrderSuccess(orderData) {
    // 1. Clear cart
    Cart.clearCart();

    // 2. Hide Checkout Modal if in modal mode
    const checkoutModalEl = document.getElementById("checkoutModal");
    if (checkoutModalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getInstance(checkoutModalEl);
      if (modalInstance) modalInstance.hide();
    }

    // 3. Show Success Modal / Content
    const successModalEl = document.getElementById("orderSuccessModal");
    if (successModalEl && typeof bootstrap !== "undefined") {
      const modal = new bootstrap.Modal(successModalEl);

      // Populate details
      document.getElementById("successOrderNumber").textContent = orderData.orderNumber;
      document.getElementById("successCustomerName").textContent = orderData.customerName;
      document.getElementById("successPhone").textContent = orderData.customerPhone;
      document.getElementById("successEmail").textContent = orderData.customerEmail;
      document.getElementById("successAddress").textContent = orderData.deliveryAddress;
      document.getElementById("successTotal").textContent = orderData.grandTotalFormatted;
      document.getElementById("successDateTime").textContent = orderData.orderDateTime;
      
      const successItemsList = document.getElementById("successItemsList");
      if (successItemsList) {
        successItemsList.innerHTML = orderData.items.map(item => `
          <div class="d-flex justify-content-between py-1 small">
            <span>${item.quantity}x ${item.name}</span>
            <span class="fw-semibold">${CozyConfig.ordering?.currencySymbol || "₦"}${Number(item.price * item.quantity).toLocaleString("en-NG")}</span>
          </div>
        `).join("");
      }

      // Configure WhatsApp tracking link
      const whatsappBtn = document.getElementById("successWhatsAppBtn");
      if (whatsappBtn) {
        const text = encodeURIComponent(
          `*Order Confirmation - Cozy'Plate*\n` +
          `Order #: *${orderData.orderNumber}*\n` +
          `Customer: ${orderData.customerName}\n` +
          `Phone: ${orderData.customerPhone}\n` +
          `Preference: ${orderData.deliveryPreference}\n` +
          `Total: ${orderData.grandTotalFormatted}\n\n` +
          `Hello! I just placed this order online and would like to track my delivery.`
        );
        whatsappBtn.href = `https://wa.me/${CozyConfig.contact.whatsapp}?text=${text}`;
      }

      modal.show();
    } else {
      // Fallback redirect or alert
      alert(`Success! Order #${orderData.orderNumber} placed successfully!`);
    }
  },

  onOrderFailed(errorMessage, orderData) {
    const errorAlertEl = document.getElementById("checkoutErrorMessage");
    const currency = CozyConfig.ordering?.currencySymbol || "₦";

    // Format a crisp WhatsApp message so the customer can send their exact order in 1 click
    const whatsappMsg = encodeURIComponent(
      `*ORDER FOR COZY'PLATE KITCHEN*\n` +
      `--------------------------------\n` +
      `*Order ID:* ${orderData.orderNumber}\n` +
      `*Date:* ${orderData.orderDateTime}\n` +
      `*Customer:* ${orderData.customerName}\n` +
      `*Phone:* ${orderData.customerPhone}\n` +
      `*Email:* ${orderData.customerEmail}\n` +
      `*Delivery Type:* ${orderData.deliveryPreference}\n` +
      `*Address:* ${orderData.deliveryAddress}\n` +
      `*Time:* ${orderData.preferredTime}\n` +
      `*Notes:* ${orderData.customerNotes}\n\n` +
      `*ORDERED ITEMS:*\n${orderData.itemsSummary}\n\n` +
      `*Subtotal:* ${orderData.subtotalFormatted}\n` +
      `*Delivery:* ${orderData.deliveryFeeFormatted}\n` +
      `*Packaging:* ${orderData.packagingFeeFormatted}\n` +
      `*GRAND TOTAL:* ${orderData.grandTotalFormatted}\n` +
      `--------------------------------\n` +
      `Please confirm my order!`
    );
    const whatsappUrl = `https://wa.me/${CozyConfig.contact.whatsapp}?text=${whatsappMsg}`;

    const errorHtml = `
      <div class="alert alert-warning border-warning shadow-sm rounded-4 p-4 mb-4" role="alert">
        <div class="d-flex align-items-start gap-3">
          <div class="rounded-circle bg-warning text-dark p-2 fs-4">
            <i class="bi bi-envelope-exclamation-fill"></i>
          </div>
          <div class="flex-grow-1">
            <h5 class="alert-heading fw-bold mb-1">Email Service Notification</h5>
            <p class="mb-2 text-dark">
              ${errorMessage}
            </p>
            <div class="p-3 bg-white rounded-3 border border-warning-subtle mb-3">
              <div class="small fw-bold text-uppercase text-muted mb-1">Don't worry! Your order #${orderData.orderNumber} is safe:</div>
              <p class="small mb-0 text-secondary">
                You can instantly transmit your exact order with one tap directly to the Cozy’Plate Kitchen WhatsApp line!
              </p>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-success fw-bold px-4 rounded-pill shadow-sm">
                <i class="bi bi-whatsapp me-2"></i> Send Order via WhatsApp (${orderData.grandTotalFormatted})
              </a>
              <button type="button" class="btn btn-outline-dark px-3 rounded-pill" onclick="CheckoutSystem.handleCheckoutSubmit(document.getElementById('cozyCheckoutForm'))">
                <i class="bi bi-arrow-repeat me-1"></i> Retry Email
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (errorAlertEl) {
      errorAlertEl.innerHTML = errorHtml;
      errorAlertEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      alert(`Notice: ${errorMessage}\n\nPlease click OK to complete via WhatsApp: ${whatsappUrl}`);
      window.open(whatsappUrl, "_blank");
    }
  }
};
