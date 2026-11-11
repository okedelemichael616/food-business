/**
 * ============================================================================
 * COZY'PLATE – KITCHEN VIBES | ORDER SERVER
 * ============================================================================
 * Serves the storefront and exposes a lightweight health check.
 * ============================================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Cozy'Plate Backend API",
    timestamp: new Date().toISOString()
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("====================================================");
    console.log(`COZY'PLATE SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}`);
    console.log("====================================================");
  });
}

module.exports = app;
