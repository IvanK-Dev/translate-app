import contrsWrapper from "../../helpers/contrsWrapper.js";
import getEntities from "./getEntities.js";
import regTranslation from "./regTranslation.js";
import getEntityById from "./getEntityById.js";

export default {
  getEntities: contrsWrapper(getEntities),
  regTranslation: contrsWrapper(regTranslation),
  getEntityById: contrsWrapper(getEntityById),
};
