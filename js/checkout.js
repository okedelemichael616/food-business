/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | CHECKOUT SYSTEM
 * ============================================================================
 * Handles customer checkout, validation, pricing, and order confirmation.
 * ============================================================================
 */

const CheckoutSystem = {
  init() {
    this.bindEvents();
    this.renderOrderSummary();
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

    const form = document.getElementById("cozyCheckoutForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit();
      });
    }

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
      if (!items.length) {
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

    if (formData.deliveryPreference === "delivery") {
      if (!formData.address || formData.address.trim().length < 8) {
        errors.push("Please provide a complete delivery address including street and landmark.");
      }
    }

    if (Cart.getItems().length === 0) {
      errors.push("Your cart is empty! Please add some dishes from the menu first.");
    }

    return errors;
  },

  handleCheckoutSubmit() {
    const fullName = document.getElementById("customerName")?.value.trim() || "";
    const phone = document.getElementById("customerPhone")?.value.trim() || "";
    const deliveryPreference = document.querySelector('input[name="deliveryPref"]:checked')?.value || "delivery";
    const address = document.getElementById("customerAddress")?.value.trim() || "";
    const area = document.getElementById("customerArea")?.value || "Abuja Municipal";
    const deliveryTime = document.getElementById("customerDeliveryTime")?.value || "As soon as ready (30-45 mins)";
    const instructions = document.getElementById("customerNotes")?.value.trim() || "No extra instructions";

    const payload = {
      fullName,
      phone,
      deliveryPreference,
      address: deliveryPreference === "pickup" ? "Self Pickup from Cozy'Plate Kitchen (A.C Umezulike St, Abuja)" : `${address} (${area})`,
      deliveryTime,
      instructions
    };

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

    const orderNumber = this.generateOrderNumber();
    const orderDateTime = this.formatOrderDateTime();
    const items = Cart.getItems();
    const currency = CozyConfig.ordering?.currencySymbol || "₦";
    const subtotal = Cart.getSubtotal();
    const deliveryFee = Cart.getDeliveryFee();
    const packagingFee = Cart.getPackagingFee();
    const grandTotal = Cart.getTotal();

    const orderPayload = {
      orderNumber,
      orderDateTime,
      customerName: fullName,
      customerPhone: phone,
      deliveryPreference: deliveryPreference.toUpperCase(),
      deliveryAddress: payload.address,
      preferredTime: deliveryTime,
      customerNotes: instructions,
      items,
      subtotalFormatted: `${currency}${subtotal.toLocaleString("en-NG")}`,
      deliveryFeeFormatted: deliveryFee === 0 ? "FREE" : `${currency}${deliveryFee.toLocaleString("en-NG")}`,
      packagingFeeFormatted: `${currency}${packagingFee.toLocaleString("en-NG")}`,
      grandTotalFormatted: `${currency}${grandTotal.toLocaleString("en-NG")}`,
      grandTotalRaw: grandTotal
    };

    const itemsSummary = orderPayload.items.map(item =>
      `- ${item.quantity}x ${item.name} (${currency}${Number(item.price).toLocaleString("en-NG")} each)`
    ).join("\n");
    const whatsappMessage = [
      "*Cozy'Plate Order*",
      `Order #: ${orderPayload.orderNumber}`,
      `Date: ${orderPayload.orderDateTime}`,
      `Name: ${orderPayload.customerName}`,
      `Phone: ${orderPayload.customerPhone}`,
      `Order type: ${orderPayload.deliveryPreference}`,
      `Address: ${orderPayload.deliveryAddress}`,
      `Preferred time: ${orderPayload.preferredTime}`,
      `Instructions: ${orderPayload.customerNotes}`,
      "",
      "*Items:*",
      itemsSummary,
      "",
      `Subtotal: ${orderPayload.subtotalFormatted}`,
      `Delivery: ${orderPayload.deliveryFeeFormatted}`,
      `Packaging: ${orderPayload.packagingFeeFormatted}`,
      `Total: ${orderPayload.grandTotalFormatted}`,
      "",
      "Please confirm my order."
    ].join("\n");
    const whatsappUrl = `https://wa.me/${CozyConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    window.location.href = whatsappUrl;
  }
};
