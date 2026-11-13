/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | SHOPPING CART SYSTEM
 * ============================================================================
 * Manages shopping cart state, persistence in localStorage, calculations,
 * and dynamic UI rendering for the offcanvas drawer and header badges.
 * ============================================================================
 */

const STORAGE_KEY = "cozyplate_cart_v1";

const Cart = {
  items: [],
  deliveryPreference: "delivery", // "delivery" or "pickup"

  init() {
    this.loadFromStorage();
    this.render();
    this.setupEventListeners();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.items = JSON.parse(saved);
      }
      const savedPref = localStorage.getItem("cozyplate_delivery_pref");
      if (savedPref) {
        this.deliveryPreference = savedPref;
      }
    } catch (e) {
      console.warn("Could not load cart from storage", e);
      this.items = [];
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      localStorage.setItem("cozyplate_delivery_pref", this.deliveryPreference);
    } catch (e) {
      console.warn("Could not save cart to storage", e);
    }
    this.dispatchUpdate();
  },

  dispatchUpdate() {
    const event = new CustomEvent("cozyCartUpdated", {
      detail: {
        items: this.items,
        count: this.getItemCount(),
        subtotal: this.getSubtotal(),
        total: this.getTotal()
      }
    });
    window.dispatchEvent(event);
  },

  getItems() {
    return this.items;
  },

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  addItem(productId, quantity = 1, specialNote = "") {
    const product = MenuUtils.getById(productId);
    if (!product) {
      console.error("Product not found:", productId);
      return false;
    }

    const existingIndex = this.items.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
      if (specialNote) {
        this.items[existingIndex].specialNote = specialNote;
      }
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryLabel: product.categoryLabel,
        quantity: quantity,
        specialNote: specialNote || ""
      });
    }

    this.saveToStorage();
    this.render();
    this.showToast(`Added "${product.name}" to cart!`, "success");
    return true;
  },

  removeItem(productId) {
    const item = this.items.find(i => i.id === productId);
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.render();
    if (item) {
      this.showToast(`Removed "${item.name}" from cart`, "info");
    }
  },

  updateQuantity(productId, newQty) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity = qty;
      this.saveToStorage();
      this.render();
    }
  },

  increaseQuantity(productId) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  },

  decreaseQuantity(productId) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      if (item.quantity > 1) {
        this.updateQuantity(productId, item.quantity - 1);
      } else {
        this.removeItem(productId);
      }
    }
  },

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.render();
    this.showToast("Your cart has been cleared", "info");
  },

  setDeliveryPreference(pref) {
    this.deliveryPreference = pref === "pickup" ? "pickup" : "delivery";
    this.saveToStorage();
    this.render();
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getDeliveryFee() {
    if (this.deliveryPreference === "pickup") return 0;
    const subtotal = this.getSubtotal();
    const threshold = (typeof CozyConfig !== "undefined" && CozyConfig.ordering?.freeDeliveryThreshold) || 25000;
    const fee = (typeof CozyConfig !== "undefined" && CozyConfig.ordering?.deliveryFee) || 800;
    
    // Free delivery if above threshold and subtotal > 0
    if (subtotal >= threshold || subtotal === 0) return 0;
    return fee;
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal + this.getDeliveryFee();
  },

  render() {
    // 1. Update Cart Badge Count in Header & Floating Buttons
    const count = this.getItemCount();
    const badgeElements = document.querySelectorAll(".cart-count-badge");
    badgeElements.forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.classList.remove("d-none");
        el.classList.add("cart-badge-bounce");
        setTimeout(() => el.classList.remove("cart-badge-bounce"), 400);
      } else {
        el.classList.add("d-none");
      }
    });

    // 2. Render Drawer Cart Items
    const cartList = document.getElementById("cartDrawerList");
    const cartEmpty = document.getElementById("cartDrawerEmpty");
    const cartFooter = document.getElementById("cartDrawerFooter");
    const subtotalEl = document.getElementById("cartDrawerSubtotal");
    const deliveryEl = document.getElementById("cartDrawerDelivery");
    const totalEl = document.getElementById("cartDrawerTotal");
    const freeDeliveryNoticeEl = document.getElementById("cartFreeDeliveryNotice");

    if (cartList && cartEmpty && cartFooter) {
      if (this.items.length === 0) {
        cartList.innerHTML = "";
        cartEmpty.classList.remove("d-none");
        cartFooter.classList.add("d-none");
      } else {
        cartEmpty.classList.add("d-none");
        cartFooter.classList.remove("d-none");

        const currencySymbol = (typeof CozyConfig !== "undefined" && CozyConfig.ordering?.currencySymbol) || "₦";
        const subtotal = this.getSubtotal();
        const deliveryFee = this.getDeliveryFee();
        const total = this.getTotal();
        const threshold = (typeof CozyConfig !== "undefined" && CozyConfig.ordering?.freeDeliveryThreshold) || 25000;

        cartList.innerHTML = this.items.map(item => `
          <div class="cart-item-card d-flex align-items-center gap-3 p-3 mb-2 rounded-3 border">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img rounded-3 object-fit-cover" width="68" height="68" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'">
            <div class="flex-grow-1 min-w-0">
              <h6 class="cart-item-title mb-1 text-truncate">${item.name}</h6>
              <div class="cart-item-price fw-semibold text-primary mb-2">
                ${currencySymbol}${Number(item.price).toLocaleString("en-NG")}
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="quantity-controller d-inline-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                  <button type="button" class="btn btn-sm p-0 text-muted btn-qty-minus" onclick="Cart.decreaseQuantity('${item.id}')" aria-label="Decrease quantity">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="px-2 fw-bold item-qty-display">${item.quantity}</span>
                  <button type="button" class="btn btn-sm p-0 text-muted btn-qty-plus" onclick="Cart.increaseQuantity('${item.id}')" aria-label="Increase quantity">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <span class="text-muted small ms-auto fw-medium">
                  ${currencySymbol}${Number(item.price * item.quantity).toLocaleString("en-NG")}
                </span>
              </div>
            </div>
            <button type="button" class="btn btn-outline-danger btn-sm rounded-circle p-1 ms-1 text-danger border-0" onclick="Cart.removeItem('${item.id}')" title="Remove item" aria-label="Remove item">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        `).join("");

        if (subtotalEl) subtotalEl.textContent = `${currencySymbol}${subtotal.toLocaleString("en-NG")}`;
        if (deliveryEl) {
          deliveryEl.textContent = deliveryFee === 0 ? "FREE" : `${currencySymbol}${deliveryFee.toLocaleString("en-NG")}`;
          if (deliveryFee === 0) deliveryEl.classList.add("text-success", "fw-bold");
          else deliveryEl.classList.remove("text-success", "fw-bold");
        }
        if (totalEl) totalEl.textContent = `${currencySymbol}${total.toLocaleString("en-NG")}`;

        if (freeDeliveryNoticeEl) {
          if (this.deliveryPreference === "pickup") {
            freeDeliveryNoticeEl.innerHTML = `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-shop me-1"></i> Pickup from Kitchen Selected</span>`;
          } else if (subtotal >= threshold) {
            freeDeliveryNoticeEl.innerHTML = `<span class="badge bg-success text-white"><i class="bi bi-check-circle me-1"></i> You unlocked FREE Delivery!</span>`;
          } else {
            const difference = threshold - subtotal;
            freeDeliveryNoticeEl.innerHTML = `<span class="small text-muted"><i class="bi bi-truck me-1"></i> Add <strong>${currencySymbol}${difference.toLocaleString("en-NG")}</strong> more for FREE delivery!</span>`;
          }
        }
      }
    }

    // 3. Update Checkout Page order summary if on checkout view
    if (typeof CheckoutView !== "undefined" && typeof CheckoutView.renderOrderSummary === "function") {
      CheckoutView.renderOrderSummary();
    }
  },

  showToast(message, type = "success") {
    const toastContainer = document.getElementById("cozyToastContainer");
    if (!toastContainer) return;

    const toastId = "toast_" + Date.now();
    const bgClass = type === "success" ? "bg-dark text-white border-primary" : "bg-white text-dark border-secondary";
    const icon = type === "success" ? "bi-check2-circle text-warning" : "bi-info-circle text-primary";

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border shadow-lg show" role="alert" aria-live="assertive" aria-atomic="true" style="border-radius: 14px; min-width: 280px; z-index: 1090;">
        <div class="d-flex p-3 align-items-center">
          <i class="bi ${icon} fs-4 me-3"></i>
          <div class="toast-body p-0 flex-grow-1 fw-medium">
            ${message}
          </div>
          <button type="button" class="btn-close ${type === "success" ? "btn-close-white" : ""} ms-2 p-1" data-bs-dismiss="toast" aria-label="Close" onclick="document.getElementById('${toastId}').remove()"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML("beforeend", toastHtml);
    setTimeout(() => {
      const el = document.getElementById(toastId);
      if (el) {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 300);
      }
    }, 3200);
  },

  setupEventListeners() {
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        this.loadFromStorage();
        this.render();
      }
    });
  }
};
