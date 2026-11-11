/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | BUSINESS CONFIGURATION
 * ============================================================================
 * This file contains all the business details, contact information, operational
 * hours, delivery rates, and email notification settings.
 * 
 * The business owner can easily edit this file to update contact details,
 * prices, delivery fees, or email configurations.
 * ============================================================================
 */

const CozyConfig = {
  // Business Brand Information
  business: {
    name: "Cozy’Plate",
    tagline: "Kitchen Vibes",
    slogan: "Good Food. Great Moments. Cozy’Plate.",
    subheadline: "Experience delicious, freshly prepared meals made with love. Bringing the authentic taste of Nigerian cuisine straight to your table.",
    description: "Cozy’Plate is a premium Nigerian kitchen and food delivery service crafting authentic, soul-warming West African dishes with love, farm-fresh ingredients, and uncompromised culinary standards.",
    establishedYear: "2023",
  },

  // Contact and Physical Business Location
  contact: {
    // Physical Address in Abuja, Nigeria
    address: "Behind Hajji faith Under.G, Ogbomosho",
    city: "Ogbomosho",
    state: "oyo",
    country: "Nigeria",
    
    // Primary Phone Number for Calls
    phone: "+234 810 945 6526",
    phoneDisplay: "+234 (0) 810 945 6526",
    phoneRaw: "+234 810 945 6526", // E.164 format for tel: links
    
    // WhatsApp Contact for Direct Ordering & Instant Kitchen Chat
    whatsapp: "+2348109456526",
    whatsappDisplay: "+234 810 945 6526",
    WhatsappWelcomeMessage: "Hello Cozy'Plate! I would like to place an order from your menu.",
    
    // Official Business & Order Notification Email
    email: "cozyplatekitchen@gmail.com",
    
    // Google Maps Navigation Coordinates & URL
    mapsUrl: "https://maps.google.com/?q=A.C+Umezulike+Street+Abuja+Municipal+Area+Council+Abuja+Nigeria",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126093.75471449033!2d7.401962!3d9.05785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf9a7385f9%3A0xb3df88b907e8efea!2sAbuja%2C%20Federal%20Capital%20Territory!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
  },

  // Operating Days and Kitchen Hours
  hours: {
    schedule: [
      { days: "Monday – Saturday", time: "6:00 AM – 5:00 PM", status: "Open" },
      { days: "Sunday", time: "12:30 AM – 11:00 PM", status: "Closed" },
      { days: "Sunday", time: "Closed (Kitchen Prep & Private Catering)", status: "Closed" }
    ],
    // Quick summary string for headers and footer
    summary: "Mon – Sat: 6:00 AM – 5:00 PM | Delivery start by 7pm. (Sunday: Closed)",
    deliveryNotice: "Delivery start by 7pm."
  },

  // Ordering & Pricing Settings
  ordering: {
    currencySymbol: "₦",
    currencyCode: "NGN",
    // Standard Abuja Municipal delivery fee
    deliveryFee: 1500,
    // Free delivery on large orders (e.g., above ₦25,000)
    freeDeliveryThreshold: 25000,
    // Eco-friendly leak-proof food packaging pack
    packagingFee: 500,
    // Average kitchen preparation and dispatch window
    estimatedPrepTime: "30 – 45 minutes",
    minOrderAmount: 2000
  },

  // Social Media Links
  socials: {
    instagram: "https://instagram.com/cozyplate_kitchenvibes",
    facebook: "https://facebook.com/cozyplatekitchen",
    twitter: "https://twitter.com/cozyplate_ng",
    tiktok: "https://tiktok.com/@cozyplatekitchen"
  },

  // Email Notification Integration Settings
  // Configure how customer orders are delivered straight to the owner's Gmail inbox
  email: {
    // Delivery mode: "emailjs" (client-side secure serverless) OR "backend" (Node.js/Express) OR "both"
    mode: "emailjs",

    // Destination Gmail address for all customer orders
    ownerGmail: "cozyplatekitchen@gmail.com",

    // EmailJS Configuration (Recommended: free, works instantly without hosting a backend)
    // Sign up at https://www.emailjs.com/ (takes 2 minutes)
    emailjs: {
      // Your EmailJS Public Key (Found in EmailJS Dashboard -> Account -> API Keys)
      publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
      // Your EmailJS Service ID connected to Gmail
      serviceId: "service_cozyplate",
      // Your EmailJS Template ID for Kitchen Order Notifications
      templateIdOwner: "template_cozy_order",
      // Optional EmailJS Template ID for Customer Order Confirmations
      templateIdCustomer: "template_cozy_customer",
      // When set to false, if EmailJS keys are placeholder, system prompts friendly instructions
      // and offers an instant 1-click WhatsApp order fallback so no customer order is ever lost!
      mockOnPlaceholder: true
    },

    // Backend Node.js / Express Server API (Optional alternative)
    backend: {
      endpoint: "http://localhost:3000/api/orders",
      enabled: false
    }
  }
};

// Freeze object in production to prevent accidental tampering
if (typeof Object.freeze === "function") {
  Object.freeze(CozyConfig);
}
