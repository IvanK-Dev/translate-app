import express from "express";
import contrs from "../../controllers/products/index.js";
const router = express.Router();

router.get("/count", contrs.countProducts);

router.get("/create", contrs.createProduct);

router.post("/", contrs.getProducts);

export default router;
