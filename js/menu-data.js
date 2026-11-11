/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | FOOD MENU DATA
 * ============================================================================
 * Authentic, mouth-watering Nigerian meals organized into 5 primary categories:
 *  1. Rice Bowls
 *  2. Daily Yum
 *  3. Cozy Weekend
 *  4. Chef Specials
 *  5. Proteins & Sides
 * 
 * To edit prices, dish names, descriptions, or images, simply update the fields
 * in this file. The website updates automatically without needing to touch HTML.
 * ============================================================================
 */

const CozyMenuCategories = [
  { id: "all", name: "All Dishes", icon: "bi-grid-fill" },
  { id: "rice-bowls", name: "Rice Bowls", icon: "bi-cup-hot-fill" },
  { id: "daily-yum", name: "Daily Yum", icon: "bi-fire" },
  { id: "cozy-weekend", name: "Cozy Weekend", icon: "bi-stars" },
  { id: "chef-specials", name: "Chef Specials", icon: "bi-award-fill" },
  { id: "proteins", name: "Proteins & Sides", icon: "bi-egg-fried" }
];

const CozyMenuItems = [
  // --------------------------------------------------------------------------
  // 1. RICE BOWLS
  // --------------------------------------------------------------------------
  {
    id: "rb-01",
    name: "Smoky Party Jollof Bowl",
    category: "rice-bowls",
    categoryLabel: "Rice Bowls",
    price: 3500,
    shortDescription: "smoked Nigerian Jollof rice served with golden sweet fried plantains (Optional) and succulent peppered chicken.",
    description: "Our signature Nigerian party Jollof rice, cooked slowly over real flame to achieve that deeply craved firewood smoke aroma. Infused with rich plum tomato relish, habanero scotch bonnets, bay leaves, and aromatic native spices. Crowned with sweet golden fried dodo and tender, succulent peppered chicken.",
    image: "images/smokeyjolloef.png",
    badge: "Bestseller",
    badgeClass: "badge-bestseller",
    spiceLevel: "Medium",
    prepTime: "40 mins",
    calories: "680 kcal",
    rating: 4.9,
    reviewsCount: 38,
    isPopular: true
  },
  {
    id: "rb-02",
    name: "Signature Fried Rice Bowl",
    category: "rice-bowls",
    categoryLabel: "Rice Bowls",
    price: 3500,
    shortDescription: "Fragrant seasoned rice tossed with garden sweet corn, green peas, crispy carrots, tender liver cubes, and sliced cucumber.",
    description: "Long grain aromatic basmati rice wok-tossed in concentrated chicken stock, fresh curry, thyme, sweet corn, tender cow liver bits, and . Served alongside crisp garden coleslaw .",
    image: "images/friedrice.png",
    badge: "Chef's Pick",
    badgeClass: "badge-chef",
    spiceLevel: "Mild",
    prepTime: "40 mins",
    calories: "640 kcal",
    rating: 4.8,
    reviewsCount: 29,
    isPopular: true
  },
  {
    id: "rb-03",
    name: "Native Village Rice Bowl",
    category: "rice-bowls",
    categoryLabel: "Rice Bowls",
    price: 3500,
    shortDescription: "Authentic palm oil rice infused with fermented locust beans (Iru), dried  fish, crayfish, scent leaves.",
    description: "An evocative, heartwarming traditional classic. Rich unbleached red palm oil rice infused with pungent fermented locust beans (iru), smoked catfish flakes, dry prawns, and fragrant fresh scent leaves (efinrin). Loaded with juicy cuts of smoked turkey.",
    image: "images/nativerice.png",
    badge: "Traditional",
    badgeClass: "badge-trad",
    spiceLevel: "Hot",
    prepTime: "40 mins",
    calories: "710 kcal",
    rating: 4.9,
    reviewsCount: 22,
    isPopular: false
  },
  {
    id: "rb-04",
    name: "Sizzling pasta",
    category: "daily-yum",
    categoryLabel: "daily-yum",
    price: 4000,
    shortDescription: "A delicious serving of perfectly cooked pasta tossed in a rich, flavourful sauce, infused with aromatic spices, fresh ingredients and a touch of heat. Every bite delivers a burst of savoury goodness that leaves you craving more..",
    description: "Locally harvested aromatic brown Ofada rice served inside a green plantain leaf wrap alongside fiery, authentic bleached-oil Ayamase (designer stew) cooked with blended green habaneros, locust beans, diced tripe (shaki), beef chunks, and a hard-boiled egg.",
    image: "images/pasta.png",
    badge: "Must Try",
    badgeClass: "badge-spicy",
    spiceLevel: "Medium",
    prepTime: "30 mins",
    calories: "780 kcal",
    rating: 5.0,
    reviewsCount: 45,
    isPopular: true
  },
  {
    id: "rb-05",
    name: "White Rice with sauce",
    category: "rice-bowls",
    categoryLabel: "Rice Bowls",
    price: 3500,
    shortDescription: "luffy, perfectly cooked white rice served with rich, savoury sauce and juicy, well-seasoned chicken.",
    description: "Delicately sweet and savory long grain rice simmered slowly in virgin pressed coconut milk, habanero peppers, and fresh herbs. Accompanied by crispy golden plantains and a pepper-glazed croaker fish fillet.",
    image: "images/whiterice2.png",
    badge: "Smooth & Rich",
    badgeClass: "badge-chef",
    spiceLevel: "Mild",
    prepTime: "30 mins",
    calories: "620 kcal",
    rating: 4.7,
    reviewsCount: 19,
    isPopular: false
  },

  // --------------------------------------------------------------------------
  // 2. DAILY YUM (Traditional Soups & Swallows)
  // --------------------------------------------------------------------------
  {
    id: "dy-01",
    name: "Royal Egusi Soup (per liter)",
    category: "Soup bowl",
    categoryLabel: "Soup bowl",
    price: 7500,
    shortDescription: "Lumpy hand-rolled melon seed stew with fluted pumpkin (Ugu) leaves, ponmo, dried fish, Iru(locust beans) and tender meat.",
    description: "Rich, textured Nigerian Egusi soup slowly simmered in seasoned broth with fluted pumpkin (ugu) leaves, bitter leaf accents, deboned dried catfish, stockfish ear, and tender braised goat meat. Served with steaming smooth Pounded Yam (or Eba / Semo upon request).",
    image: "images/egusi.png",
    badge: "House Classic",
    badgeClass: "badge-bestseller",
    spiceLevel: "Medium",
    prepTime: "30 mins",
    calories: "850 kcal",
    rating: 5.0,
    reviewsCount: 52,
    isPopular: true
  },
  {
    id: "dy-02",
    name: "Okra Soup",
    category: "Soup bowl",
    categoryLabel: "Soup bowl",
    price: 5000,
    shortDescription: "Crunchy chopped okra stew brimming with fresh pepper,Iru(locust beans),ponmo and dried fish.",
    description: "A coastal delicacy bursting with the freshest ingredient. Crisp, hand-chopped okra simmered in rich protain, and dried fish. Highly restorative and delightfully silky.",
    image: "images/okra.png",
    badge: "slimming",
    badgeClass: "badge-special",
    spiceLevel: "High",
    prepTime: "20 mins",
    calories: "720 kcal",
    rating: 4.9,
    reviewsCount: 34,
    isPopular: true
  },
  {
    id: "dy-03",
    name: "Efo Riro (vegetable soup)",
    category: "Soup bow",
    categoryLabel: "Soup bow",
    price: 7500,
    shortDescription: "Rich Yorùbá-style vegetable stew prepared with shaki,  soft pomo, dried panla fish, and assorted beef.",
    description: "Freshly harvested green amaranth (shoko) and fluted pumpkin leaves tossed in concentrated red pepper sauce with fermented locust beans, soft cow skin (pomo), honeycomb tripe (shaki), and tender beef bites. Deeply satisfying comfort in every scoop.",
    image: "images/efo.png",
    badge: "Nutritious",
    badgeClass: "badge-trad",
    spiceLevel: "Hot",
    prepTime: "30 mins",
    calories: "690 kcal",
    rating: 4.8,
    reviewsCount: 26,
    isPopular: false
  },
  {
    id: "dy-04",
    name: "Noodles and scrambled eggs",
    category: "daily-yum",
    categoryLabel: "Daily Yum",
    price: 2500,
    shortDescription: "Silky wild mango seed stew enriched with crayfish, bitterleaf, dried fish, and savory cuts of tender cow meat.",
    description: "Authentic Ogbono soup cooked to silky perfection with crushed crayfish, red palm oil, uziza pepper notes, and generous cuts of beef, tender shaki, and dried catfish. Served hot with your choice of traditional swallow.",
    image: "images/noodles2.png",
    badge: "Comfort Bowl",
    badgeClass: "badge-chef",
    spiceLevel: "Medium",
    prepTime: "25 mins",
    calories: "810 kcal",
    rating: 4.7,
    reviewsCount: 18,
    isPopular: false
  },
  {
    id: "dy-05",
    name: "Delta Banga Soup & Starch",
    category: "daily-yum",
    categoryLabel: "Daily Yum",
    price: 6500,
    shortDescription: "Rich palm fruit extract soup spiced with oburunbebe stick, rohohie herbs, fresh fish, and dry catfish, served with yellow starch.",
    description: "Traditional Niger-Delta Oghwo Amiedi (Banga Soup) crafted from freshly squeezed ripe palm nut pulp, seasoned with authentic aromatic native spices, dried catfish, fresh goat meat, and scent leaves. Served with traditional soft Delta yellow starch.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
    badge: "Delta Heritage",
    badgeClass: "badge-special",
    spiceLevel: "Medium",
    prepTime: "30 mins",
    calories: "890 kcal",
    rating: 4.9,
    reviewsCount: 21,
    isPopular: false
  },

  // --------------------------------------------------------------------------
  // 3. COZY WEEKEND (Feasts & Party Sharing Boxes)
  // --------------------------------------------------------------------------
  {
    id: "cw-01",
    name: "Cozy Platter Feast (Feeds 2-3)",
    category: "cozy-weekend",
    categoryLabel: "Cozy Weekend",
    price: 14500,
    shortDescription: "The ultimate sharing box: Firewood Jollof, Fried Rice, 2 Grilled Turkey wings, Asun Goat Meat, Peppered Gizzard, Dodo & Slaw.",
    description: "Designed for romantic weekend dinners, family unwinding, or food-loving friends. Generous portions of our Firewood Jollof and Signature Fried Rice, accompanied by 2 jumbo peppered turkey wings, spicy grilled goat meat (Asun), peppered gizzard bites, golden fried dodo, and freshly prepared coleslaw.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    badge: "Mega Feast",
    badgeClass: "badge-bestseller",
    spiceLevel: "Medium Hot",
    prepTime: "40 mins",
    calories: "1850 kcal (shared)",
    rating: 5.0,
    reviewsCount: 64,
    isPopular: true
  },
  {
    id: "cw-02",
    name: "Weekend Seafood Jollof Mega Box",
    category: "cozy-weekend",
    categoryLabel: "Cozy Weekend",
    price: 12800,
    shortDescription: "Smoky party jollof topped with giant grilled tiger prawns, peppered fried croaker fish, calamari rings, and boiled eggs.",
    description: "A lavish celebration of West African seafood gastronomy. Firewood smoked jollof rice layered with flame-grilled giant tiger prawns, crispy peppered croaker fish fillets, seasoned calamari rings, and steamed eggs. Guaranteed to make your weekend unforgettable.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    badge: "Weekend Treat",
    badgeClass: "badge-special",
    spiceLevel: "Medium",
    prepTime: "35 mins",
    calories: "1120 kcal",
    rating: 4.9,
    reviewsCount: 31,
    isPopular: true
  },
  {
    id: "cw-03",
    name: "Sunday Asun & Yam Pottage (Asaro)",
    category: "cozy-weekend",
    categoryLabel: "Cozy Weekend",
    price: 6800,
    shortDescription: "Velvety mashed yam pottage cooked in palm oil, crayfish, and dried fish, crowned with fiery grilled goat meat (Asun).",
    description: "Slow-cooked sweet white yam chunks cooked in palm oil, blended peppers, crayfish, and dried bonga fish until meltingly tender. Crowned with a mountain of spicy, smoky peppered goat meat straight off the charcoal grill.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
    badge: "Sunday Special",
    badgeClass: "badge-trad",
    spiceLevel: "Hot",
    prepTime: "30 mins",
    calories: "790 kcal",
    rating: 4.8,
    reviewsCount: 27,
    isPopular: false
  },
  {
    id: "cw-04",
    name: "Gizdodo Weekend Special",
    category: "cozy-weekend",
    categoryLabel: "Cozy Weekend",
    price: 5000,
    shortDescription: "Tender fried chicken gizzards and ripe plantain cubes tossed in rich, fiery habanero tomato sauce with sweet bell peppers.",
    description: "The crowd-favorite Nigerian small chop sensation. Golden sweet plantain cubes and tender, slow-braised chicken gizzards tossed in a fiery, sweet, and tangy scotch bonnet and bell pepper reduction. Delicious on its own or as a hearty side.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    badge: "Addictive",
    badgeClass: "badge-spicy",
    spiceLevel: "Hot",
    prepTime: "25 mins",
    calories: "580 kcal",
    rating: 4.9,
    reviewsCount: 39,
    isPopular: true
  },

  // --------------------------------------------------------------------------
  // 4. CHEF SPECIALS
  // --------------------------------------------------------------------------
  {
    id: "cs-01",
    name: "Fresh Catfish Pepper Soup (Point & Kill)",
    category: "chef-specials",
    categoryLabel: "Chef Specials",
    price: 6500,
    shortDescription: "Whole fresh catfish cutlet simmered in an aromatic, herbal restorative broth infused with scent leaves and African nutmeg (Ehuru).",
    description: "Freshly dressed live catfish cooked gently in a steaming, fragrant broth with ground African orchid pods (uda), calabash nutmeg (ehuru), uziza seeds, and freshly plucked scent leaves. Deeply comforting, invigorating, and delightfully spicy.",
    image: "https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=80",
    badge: "Signature",
    badgeClass: "badge-chef",
    spiceLevel: "Extra Hot",
    prepTime: "30 mins",
    calories: "450 kcal",
    rating: 5.0,
    reviewsCount: 41,
    isPopular: true
  },
  {
    id: "cs-02",
    name: "Slow-Cooked Goat Meat Pepper Soup",
    category: "chef-specials",
    categoryLabel: "Chef Specials",
    price: 5800,
    shortDescription: "Tender chunks of bone-in goat meat slow-simmered in fiery, peppery native herbs, uziza, and aromatics.",
    description: "Slow-simmered for hours until the goat meat effortlessly slips from the bone. Packed with authentic restorative botanicals, habanero peppers, and fragrant dry herbs. The perfect pick-me-up any evening.",
    image: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?auto=format&fit=crop&w=800&q=80",
    badge: "Warming & Spicy",
    badgeClass: "badge-spicy",
    spiceLevel: "Extra Hot",
    prepTime: "25 mins",
    calories: "490 kcal",
    rating: 4.8,
    reviewsCount: 33,
    isPopular: false
  },
  {
    id: "cs-03",
    name: "Firewood Native Stir-Fry Pasta",
    category: "chef-specials",
    categoryLabel: "Chef Specials",
    price: 4600,
    shortDescription: "Nigerian party-style spaghetti tossed in hot pepper relish, crayfish, diced sausages, and shredded smoked chicken.",
    description: "An iconic Nigerian street and party innovation. Long spaghetti cooked in intensely flavorful pepper broth with smoked crayfish, diced beef sausages, shredded chicken, and sweet onions. Spicy, saucy, and delightfully satisfying.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    badge: "Party Vibes",
    badgeClass: "badge-special",
    spiceLevel: "Hot",
    prepTime: "25 mins",
    calories: "620 kcal",
    rating: 4.7,
    reviewsCount: 20,
    isPopular: false
  },
  {
    id: "cs-04",
    name: "Honey Glazed Jumbo Turkey Bowl",
    category: "chef-specials",
    categoryLabel: "Chef Specials",
    price: 6000,
    shortDescription: "Sweet and spicy honey-chili glazed grilled turkey served over spiced jollof rice with fried sweet plantains.",
    description: "Charcoal-grilled jumbo turkey basted in a sticky, sweet-and-spicy wild honey and scotch bonnet glaze. Plated over fragrant Jollof rice with caramelized fried plantain medallions.",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    badge: "Sweet & Spicy",
    badgeClass: "badge-chef",
    spiceLevel: "Medium",
    prepTime: "30 mins",
    calories: "760 kcal",
    rating: 4.9,
    reviewsCount: 24,
    isPopular: false
  },

  // --------------------------------------------------------------------------
  // 5. PROTEINS & SIDES
  // --------------------------------------------------------------------------
  {
    id: "pr-01",
    name: "Spicy Northern Beef Suya Skewers",
    category: "proteins",
    categoryLabel: "Proteins & Sides",
    price: 3500,
    shortDescription: "Thinly sliced tender beef marinated in authentic Northern Nigerian Yaji spice blend, grilled over coal, served with onions.",
    description: "Prepared by our master grill chef using authentic artisanal Hausa Yaji spice (kuli-kuli, ginger, chili, garlic, and sea salt). Flash-grilled over hot coals and served with raw red onion rings, fresh tomatoes, and spicy cabbage slaw.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    badge: "Grill Master",
    badgeClass: "badge-bestseller",
    spiceLevel: "Extra Hot",
    prepTime: "20 mins",
    calories: "410 kcal",
    rating: 5.0,
    reviewsCount: 58,
    isPopular: true
  },
  {
    id: "pr-02",
    name: "Peppered Goat Meat (Asun Special)",
    category: "proteins",
    categoryLabel: "Proteins & Sides",
    price: 4200,
    shortDescription: "Smoky, fire-roasted goat meat cut into bite-sized morsels and sautéed with fiery scotch bonnets and sweet onions.",
    description: "Authentic Ondo-style Asun. Roasted bone-in goat meat chopped into succulent bite-sized portions, sautéed in a blazing pan with crushed habanero peppers, bell peppers, and sliced sweet onions. Crispy on the outside, juicy on the inside.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    badge: "Fiery Asun",
    badgeClass: "badge-spicy",
    spiceLevel: "Extra Hot",
    prepTime: "20 mins",
    calories: "460 kcal",
    rating: 4.9,
    reviewsCount: 47,
    isPopular: true
  },
  {
    id: "pr-03",
    name: "Grilled Jumbo Turkey Wing",
    category: "proteins",
    categoryLabel: "Proteins & Sides",
    price: 3800,
    shortDescription: "Succulent, flame-grilled turkey wing dipped in hot pepper sauce with herbs and spices.",
    description: "A gigantic, meaty turkey wing parboiled in rich aromatics, seasoned with Nigerian spices, and flame-grilled to a golden char before receiving a glossy bath in our secret hot pepper sauce.",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    badge: "Customer Favorite",
    badgeClass: "badge-chef",
    spiceLevel: "Medium Hot",
    prepTime: "20 mins",
    calories: "520 kcal",
    rating: 4.8,
    reviewsCount: 31,
    isPopular: false
  },
  {
    id: "pr-04",
    name: "Crispy Fried Titus Fish Cutlet",
    category: "proteins",
    categoryLabel: "Proteins & Sides",
    price: 3200,
    shortDescription: "Crispy-skinned whole Titus (mackerel) fish basted with aromatic spicy red pepper glaze.",
    description: "Freshly sourced Titus fish seasoned with garlic, ginger, thyme, and bouillons, deep-fried until wonderfully crispy on the edges while remaining moist and flaky inside. Glazed with hot red pepper relish.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    badge: "Fresh Catch",
    badgeClass: "badge-special",
    spiceLevel: "Medium",
    prepTime: "20 mins",
    calories: "380 kcal",
    rating: 4.7,
    reviewsCount: 19,
    isPopular: false
  },
  {
    id: "pr-05",
    name: "Golden Fried Dodo (Sweet Plantains)",
    category: "proteins",
    categoryLabel: "Proteins & Sides",
    price: 1500,
    shortDescription: "Caramelized, naturally sweet ripe plantain slices fried to tender golden-brown perfection.",
    description: "Sweet, naturally sun-ripened yellow plantains sliced and fried to golden caramel perfection. Crispy on the outside, tender and sweet on the inside. The quintessential companion to every Nigerian dish.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    badge: "Must-Have Side",
    badgeClass: "badge-trad",
    spiceLevel: "None",
    prepTime: "15 mins",
    calories: "280 kcal",
    rating: 4.9,
    reviewsCount: 60,
    isPopular: true
  },
  {
    id: "pr-06",
    name: "Extra Swallow (Pounded Yam / Eba / Semo)",
    category: "proteins",
    categoryLabel: "Proteins & Sides",
    price: 1000,
    shortDescription: "Piping hot, freshly prepared traditional swallow portion wrapped warm.",
    description: "Smooth, lump-free traditional swallow of your choice: Authentic Pounded Yam, Garri (Yellow or White Eba), or Smooth Semovita.",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80",
    badge: "Side",
    badgeClass: "badge-chef",
    spiceLevel: "None",
    prepTime: "10 mins",
    calories: "350 kcal",
    rating: 4.8,
    reviewsCount: 15,
    isPopular: false
  }
];

// Helper functions for menu queries
const MenuUtils = {
  getAll: () => CozyMenuItems,
  getById: (id) => CozyMenuItems.find(item => item.id === id),
  getByCategory: (category) => {
    if (!category || category === "all") return CozyMenuItems;
    return CozyMenuItems.filter(item => item.category === category);
  },
  search: (keyword) => {
    if (!keyword) return CozyMenuItems;
    const lower = keyword.toLowerCase().trim();
    return CozyMenuItems.filter(item => 
      item.name.toLowerCase().includes(lower) ||
      item.shortDescription.toLowerCase().includes(lower) ||
      item.categoryLabel.toLowerCase().includes(lower) ||
      (item.badge && item.badge.toLowerCase().includes(lower))
    );
  },
  formatPrice: (amount) => {
    const symbol = (typeof CozyConfig !== "undefined" && CozyConfig.ordering?.currencySymbol) || "₦";
    return `${symbol}${Number(amount).toLocaleString("en-NG")}`;
  }
};
