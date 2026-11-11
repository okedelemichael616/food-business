/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | BUSINESS CONFIGURATION
 * ============================================================================
 * This file contains the business details, contact info, hours, and pricing.
 * ============================================================================
 */

const CozyConfig = {
  business: {
    name: "Cozy’Plate",
    tagline: "Kitchen Vibes",
    slogan: "Good Food. Great Moments. Cozy’Plate.",
    subheadline: "Experience delicious, freshly prepared meals made with love. Bringing the authentic taste of Nigerian cuisine straight to your table.",
    description: "Cozy’Plate is a premium Nigerian kitchen and food delivery service crafting authentic, soul-warming West African dishes with love, farm-fresh ingredients, and uncompromised culinary standards.",
    establishedYear: "2023"
  },

  contact: {
    address: "Behind Hajji faith Under.G, Ogbomosho",
    city: "Ogbomosho",
    state: "oyo",
    country: "Nigeria",
    phone: "+234 810 945 6526",
    phoneDisplay: "+234 (0) 810 945 6526",
    phoneRaw: "+2348109456526",
    whatsapp: "+2348109456526",
    whatsappDisplay: "+234 810 945 6526",
    WhatsappWelcomeMessage: "Hello Cozy'Plate! I would like to place an order from your menu.",
    mapsUrl: "https://maps.google.com/?q=A.C+Umezulike+Street+Abuja+Municipal+Area+Council+Abuja+Nigeria",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126093.75471449033!2d7.401962!3d9.05785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf9a7385f9%3A0xb3df88b907e8efea!2sAbuja%2C%20Federal%20Capital%20Territory!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
  },

  hours: {
    schedule: [
      { days: "Monday – Saturday", time: "6:00 AM – 5:00 PM", status: "Open" },
      { days: "Sunday", time: "12:30 AM – 11:00 PM", status: "Closed" }
    ],
    summary: "Mon – Sat: 6:00 AM – 5:00 PM | Delivery start by 7pm. (Sunday: Closed)",
    deliveryNotice: "Delivery start by 7pm."
  },

  ordering: {
    currencySymbol: "₦",
    currencyCode: "NGN",
    deliveryFee: 1500,
    freeDeliveryThreshold: 25000,
    packagingFee: 500,
    estimatedPrepTime: "30 – 45 minutes",
    minOrderAmount: 2000
  },

  socials: {
    instagram: "https://instagram.com/cozyplate_kitchenvibes",
    facebook: "https://facebook.com/cozyplatekitchen",
    twitter: "https://twitter.com/cozyplate_ng",
    tiktok: "https://tiktok.com/@cozyplatekitchen"
  }
};

if (typeof Object.freeze === "function") {
  Object.freeze(CozyConfig);
}
