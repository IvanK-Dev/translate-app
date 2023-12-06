import express from "express";
import contrs from "../../controllers/api/index.js";
const router = express.Router();

router.post("/:entity", contrs.getEntity);

router.post("/translate", contrs.regTranslation);

export default router;
