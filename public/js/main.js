/**
 * ============================================================================
 * COZY'PLATE â€“ KITCHEN VIBES | MAIN APPLICATION SCRIPT
 * ============================================================================
 * Handles UI interactions, menu rendering, category filtering, search,
 * modals, image lightboxes, and smooth animations.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  currentCategory: "all",
  searchQuery: "",

  init() {
    this.initNavbar();
    this.renderMenuCategories();
    this.renderMenuItems();
    this.setupMenuSearch();
    this.setupGalleryFilter();
    this.populateBusinessDetails();
    this.initCartAndCheckout();
  },

  populateBusinessDetails() {
    if (typeof CozyConfig === "undefined") return;

    // Populate phone numbers
    document.querySelectorAll(".cp-phone-text").forEach(el => {
      el.textContent = CozyConfig.contact.phone;
    });
    document.querySelectorAll(".cp-phone-link").forEach(el => {
      el.href = `tel:${CozyConfig.contact.phoneRaw}`;
    });

    // Populate WhatsApp
    document.querySelectorAll(".cp-whatsapp-link").forEach(el => {
      const msg = encodeURIComponent(CozyConfig.contact.WhatsappWelcomeMessage);
      el.href = `https://wa.me/${CozyConfig.contact.whatsapp}?text=${msg}`;
    });

    // Populate address
    document.querySelectorAll(".cp-address-text").forEach(el => {
      el.textContent = CozyConfig.contact.address;
    });



    // Maps link
    document.querySelectorAll(".cp-map-link").forEach(el => {
      el.href = CozyConfig.contact.mapsUrl;
    });

    // Hours summary
    document.querySelectorAll(".cp-hours-summary").forEach(el => {
      el.textContent = CozyConfig.hours.summary;
    });
  },

  initNavbar() {
    const navbar = document.querySelector(".navbar-cozy");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarCollapse = document.getElementById("navbarNav");

    // Scroll state for sticky navbar
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar?.classList.add("navbar-scrolled");
      } else {
        navbar?.classList.remove("navbar-scrolled");
      }
    });

    // Auto close mobile drawer on link click
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (navbarCollapse && navbarCollapse.classList.contains("show") && typeof bootstrap !== "undefined") {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });

    // ScrollSpy active state
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute("id");
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => {
            if (l.getAttribute("href") === `#${sectionId}`) {
              l.classList.add("active");
            } else {
              l.classList.remove("active");
            }
          });
        }
      });
    });
  },

  renderMenuCategories() {
    const container = document.getElementById("menuCategoriesTabs");
    if (!container) return;

    container.innerHTML = CozyMenuCategories.map(cat => {
      const isActive = cat.id === this.currentCategory;
      const count = cat.id === "all" ? CozyMenuItems.length : CozyMenuItems.filter(i => i.category === cat.id).length;
      return `
        <button type="button" class="btn category-tab-btn ${isActive ? 'active' : ''}" data-category="${cat.id}">
          <i class="bi ${cat.icon} me-1"></i>
          <span>${cat.name}</span>
          <span class="category-count-badge">${count}</span>
        </button>
      `;
    }).join("");

    // Bind click events
    container.querySelectorAll(".category-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".category-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category;
        this.renderMenuItems();
      });
    });
  },

  renderMenuItems() {
    const container = document.getElementById("menuItemsGrid");
    if (!container) return;

    let items = MenuUtils.getByCategory(this.currentCategory);

    if (this.searchQuery) {
      const lower = this.searchQuery.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(lower) || 
        i.shortDescription.toLowerCase().includes(lower) ||
        i.categoryLabel.toLowerCase().includes(lower)
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="empty-menu-state p-5 bg-cream-soft rounded-4 border border-warning-subtle">
            <i class="bi bi-search display-5 text-warning mb-3 d-block"></i>
            <h4 class="fw-bold mb-2">No meals found</h4>
            <p class="text-muted mb-3">We couldn't find any dish matching "${this.searchQuery}". Try searching for Jollof, Egusi, Turkey, or Suya!</p>
            <button class="btn btn-outline-dark rounded-pill px-4" onclick="App.clearSearch()">
              Clear Search & Show All
            </button>
          </div>
        </div>
      `;
      return;
    }

    const currency = CozyConfig.ordering?.currencySymbol || "â‚¦";

    container.innerHTML = items.map(item => `
      <div class="col-12 col-md-6 col-lg-4 menu-item-col" data-item-id="${item.id}">
        <div class="card h-100 dish-card border-0 shadow-sm rounded-4 overflow-hidden">
          <!-- Food Image Wrapper -->
          <div class="dish-card-img-wrap position-relative">
            <img src="${item.image}" alt="${item.name}" class="card-img-top dish-img object-fit-cover" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
            
            <!-- Category & Bestseller Badges -->
            <div class="dish-badges-overlay position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
              ${item.badge ? `<span class="badge ${item.badgeClass || 'badge-bestseller'} shadow-sm">${item.badge}</span>` : ''}
              ${item.spiceLevel !== 'None' ? `<span class="badge bg-dark-subtle text-dark shadow-sm border"><i class="bi bi-fire text-danger me-1"></i>${item.spiceLevel}</span>` : ''}
            </div>

            <!-- Quick View Icon Button -->
            <button type="button" class="btn-quick-view position-absolute top-0 end-0 m-3" onclick="App.showDishDetailsModal('${item.id}')" title="Quick View" aria-label="Quick View Details">
              <i class="bi bi-eye-fill"></i>
            </button>

            <!-- Preparation Time Pill -->
            <div class="dish-prep-pill position-absolute bottom-0 start-0 m-3 px-2 py-1 rounded-pill small">
              <i class="bi bi-clock-history me-1"></i>${item.prepTime}
            </div>
          </div>

          <!-- Dish Content -->
          <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="text-uppercase tracking-wider small fw-bold text-orange">${item.categoryLabel}</span>
              <div class="dish-rating small text-warning">
                <i class="bi bi-star-fill"></i> <span class="fw-bold text-dark">${item.rating}</span> <span class="text-muted">(${item.reviewsCount})</span>
              </div>
            </div>

            <h5 class="card-title fw-bold mb-2 text-dark dish-title">${item.name}</h5>
            <p class="card-text text-muted small flex-grow-1 line-clamp-3 mb-3">
              ${item.shortDescription}
            </p>

            <!-- Price and Add to Cart Row -->
            <div class="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
              <div class="dish-price">
                <span class="fs-5 fw-bold text-primary">${currency}${Number(item.price).toLocaleString("en-NG")}</span>
              </div>
              <button type="button" class="btn btn-primary rounded-pill px-3 py-2 btn-add-cart d-flex align-items-center gap-2" onclick="Cart.addItem('${item.id}', 1)" aria-label="Add ${item.name} to Cart">
                <i class="bi bi-bag-plus"></i>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  },

  setupMenuSearch() {
    const searchInput = document.getElementById("menuSearchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim();
      this.renderMenuItems();
    });
  },

  clearSearch() {
    const searchInput = document.getElementById("menuSearchInput");
    if (searchInput) searchInput.value = "";
    this.searchQuery = "";
    this.currentCategory = "all";
    this.renderMenuCategories();
    this.renderMenuItems();
  },

  showDishDetailsModal(productId) {
    const item = MenuUtils.getById(productId);
    if (!item) return;

    const modalEl = document.getElementById("dishDetailsModal");
    if (!modalEl || typeof bootstrap === "undefined") return;

    const currency = CozyConfig.ordering?.currencySymbol || "â‚¦";

    document.getElementById("modalDishTitle").textContent = item.name;
    document.getElementById("modalDishCategory").textContent = item.categoryLabel;
    document.getElementById("modalDishPrice").textContent = `${currency}${Number(item.price).toLocaleString("en-NG")}`;
    document.getElementById("modalDishDesc").textContent = item.description;
    document.getElementById("modalDishImage").src = item.image;
    document.getElementById("modalDishImage").alt = item.name;
    document.getElementById("modalDishSpice").textContent = item.spiceLevel;
    document.getElementById("modalDishPrep").textContent = item.prepTime;
    document.getElementById("modalDishCalories").textContent = item.calories;
    document.getElementById("modalDishRating").textContent = `${item.rating} / 5 (${item.reviewsCount} customer reviews)`;

    // Configure Add to Cart inside modal
    const addBtn = document.getElementById("modalDishAddToCartBtn");
    if (addBtn) {
      addBtn.onclick = () => {
        const qtyInput = document.getElementById("modalDishQty");
        const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        const noteInput = document.getElementById("modalDishNotes");
        const note = noteInput ? noteInput.value.trim() : "";
        Cart.addItem(item.id, qty, note);
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      };
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  },

  setupGalleryFilter() {
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item-wrap");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
          if (filter === "all" || item.dataset.category === filter) {
            item.classList.remove("d-none");
          } else {
            item.classList.add("d-none");
          }
        });
      });
    });
  },

  initCartAndCheckout() {
    Cart.init();
    CheckoutSystem.init();
  }
};




