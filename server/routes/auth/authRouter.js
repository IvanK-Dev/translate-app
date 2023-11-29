import express from "express";
import shopify from "./../../shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
const router = express.Router();

// Set up Shopify authentication and webhook handling
router.get(shopify.config.auth.path, shopify.auth.begin());
router.get(shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot());
router.post(shopify.config.webhooks.path,
    shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers }));

export default router;



