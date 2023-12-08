import express from "express";
import contrs from "../../controllers/api/index.js";
const router = express.Router();

router.post("/translate", contrs.regTranslation);

router.post("/:entity", contrs.getEntity);

export default router;
