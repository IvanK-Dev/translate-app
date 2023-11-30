import express from "express";
import contrs from "../../controllers/shop/index.js";
const router = express.Router();

router.get("/", contrs.getShop);

export default router;