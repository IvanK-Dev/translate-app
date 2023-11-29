import express from "express";
import contrs from "../../controllers/products/index.js";
const router = express.Router();

router.get("/products/count", contrs.countProducts)

router.get("/products/create", contrs.createProduct);

export default router;