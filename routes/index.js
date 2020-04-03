const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const key = process.env.WEBHOOKS_SECRET;

const { routesCtl } = require("../controllers");

// This ensures that ClickUp is the only that's able to send us data
router.use((req, res, next) => {
  if (key === undefined) {
    console.error(
      "Can't propagate request. Your webhooks secret is undefined. Set your WEBHOOKS_SECRET environment variable first"
    );
    return res.sendStatus(200);
  }
  const body = JSON.stringify(req.body);
  const hash = crypto.createHmac("sha256", key).update(body);
  const signature = hash.digest("hex");
  const xSignature = req.headers["x-signature"];
  if (signature !== xSignature) {
    console.error(
      `Can't propagate request. HMAC validation failure for ${req.body.task_id}`
    );
    return res.sendStatus(403);
  }
  next();
});

router.post("/", routesCtl);

module.exports = router;
