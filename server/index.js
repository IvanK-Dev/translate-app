// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import errorHandler from "./helpers/errorHandler.js";
import authRouter from "./routes/auth/authRouter.js";
import productsRouter from "./routes/api/productsRouter.js";
import shopify from "./shopify.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${join(process.cwd(), "..", "web", "dist")}`
    : `${join(process.cwd(), "..", "web")}`;

const app = express();

app.use("/", authRouter);

// If you are adding routes outside the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.use("/api/products", productsRouter);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.use(errorHandler);

app.listen(PORT);
