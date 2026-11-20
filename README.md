# Cozy’Plate – Kitchen Vibes

A premium Nigerian food-ordering website for Cozy’Plate, built to help customers browse the menu, add dishes to a cart, and place orders with a clean checkout flow and direct WhatsApp ordering support.

## Features

- Premium storefront and responsive layout
- Menu browsing with category and search filters
- Cart management with quantity controls and totals
- Delivery and pickup checkout flow
- WhatsApp ordering handoff for kitchen confirmation
- Lightweight Express server for hosting the site and health checks

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

## Deploy to Vercel

Import the repository with its root directory set to the repository root. Vercel serves site files from `public/`; the Express server uses that same directory for local development.

## Project structure

```text
cozy/
├── public/
│   ├── index.html
│   ├── checkout.html
│   ├── css/
│   ├── js/
│   └── images/
├── server.js
├── package.json
├── .env.example
└── README.md
```
