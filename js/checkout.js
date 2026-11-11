/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | CHECKOUT SYSTEM
 * ============================================================================
 * Handles customer checkout, validation, pricing, and order confirmation.
 * ============================================================================
 */

const CheckoutSystem = {
  isSubmitting: false,

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
        this.handleCheckoutSubmit(form);
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

  async handleCheckoutSubmit(form) {
    if (this.isSubmitting) return;

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

    this.setSubmittingState(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Order could not be submitted right now.");
      }

      this.onOrderSuccess(orderPayload);
    } catch (error) {
      console.error("Order submission failed:", error);
      this.onOrderFailed(error.message || "Something went wrong while submitting your order.", orderPayload);
    } finally {
      this.setSubmittingState(false);
    }
  },

  setSubmittingState(isSubmitting) {
    this.isSubmitting = isSubmitting;
    const submitBtn = document.getElementById("btnPlaceOrder");
    if (!submitBtn) return;

    if (isSubmitting) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Placing Order...
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <i class="bi bi-shield-check me-2"></i> Place Order Now
      `;
    }
  },

  onOrderSuccess(orderData) {
    Cart.clearCart();

    const checkoutModalEl = document.getElementById("checkoutModal");
    if (checkoutModalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getInstance(checkoutModalEl);
      if (modalInstance) modalInstance.hide();
    }

    const successModalEl = document.getElementById("orderSuccessModal");
    if (successModalEl && typeof bootstrap !== "undefined") {
      const modal = new bootstrap.Modal(successModalEl);

      document.getElementById("successOrderNumber").textContent = orderData.orderNumber;
      document.getElementById("successCustomerName").textContent = orderData.customerName;
      document.getElementById("successPhone").textContent = orderData.customerPhone;
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

      const whatsappBtn = document.getElementById("successWhatsAppBtn");
      if (whatsappBtn) {
        const text = encodeURIComponent(
          `*Order Confirmation - Cozy'Plate*\n` +
          `Order #: *${orderData.orderNumber}*\n` +
          `Customer: ${orderData.customerName}\n` +
          `Phone: ${orderData.customerPhone}\n` +
          `Preference: ${orderData.deliveryPreference}\n` +
          `Total: ${orderData.grandTotalFormatted}\n\n` +
          `Hello! I just placed this order and would like to confirm it with the kitchen.`
        );
        whatsappBtn.href = `https://wa.me/${CozyConfig.contact.whatsapp}?text=${text}`;
      }

      modal.show();
    } else {
      alert(`Success! Order #${orderData.orderNumber} placed successfully!`);
    }
  },

  onOrderFailed(errorMessage, orderData) {
    const errorAlertEl = document.getElementById("checkoutErrorMessage");
    const whatsappMsg = encodeURIComponent(
      `*ORDER FOR COZY'PLATE KITCHEN*\n` +
      `--------------------------------\n` +
      `*Order ID:* ${orderData.orderNumber}\n` +
      `*Date:* ${orderData.orderDateTime}\n` +
      `*Customer:* ${orderData.customerName}\n` +
      `*Phone:* ${orderData.customerPhone}\n` +
      `*Delivery Type:* ${orderData.deliveryPreference}\n` +
      `*Address:* ${orderData.deliveryAddress}\n` +
      `*Time:* ${orderData.preferredTime}\n` +
      `*Notes:* ${orderData.customerNotes}\n\n` +
      `*ORDERED ITEMS:*\n${orderData.items.map(item => `• ${item.quantity}x ${item.name}`).join("\n")}\n\n` +
      `*Total:* ${orderData.grandTotalFormatted}\n` +
      `--------------------------------\n` +
      `Please confirm my order!`
    );
    const whatsappUrl = `https://wa.me/${CozyConfig.contact.whatsapp}?text=${whatsappMsg}`;

    const errorHtml = `
      <div class="alert alert-warning border-warning shadow-sm rounded-4 p-4 mb-4" role="alert">
        <div class="d-flex align-items-start gap-3">
          <div class="rounded-circle bg-warning text-dark p-2 fs-4">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div class="flex-grow-1">
            <h5 class="alert-heading fw-bold mb-1">Order Notice</h5>
            <p class="mb-2 text-dark">
              ${errorMessage}
            </p>
            <div class="p-3 bg-white rounded-3 border border-warning-subtle mb-3">
              <div class="small fw-bold text-uppercase text-muted mb-1">Your order is still safe:</div>
              <p class="small mb-0 text-secondary">
                Send the exact order details directly to the Cozy’Plate WhatsApp kitchen line in one tap.
              </p>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-success fw-bold px-4 rounded-pill shadow-sm">
                <i class="bi bi-whatsapp me-2"></i> Send Order via WhatsApp
              </a>
              <button type="button" class="btn btn-outline-dark px-3 rounded-pill" onclick="CheckoutSystem.handleCheckoutSubmit(document.getElementById('cozyCheckoutForm'))">
                <i class="bi bi-arrow-repeat me-1"></i> Retry Order
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
