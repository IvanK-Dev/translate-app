import contrsWrapper from "../../helpers/contrsWrapper.js";
import getEntity from "./getEntity.js";
import regTranslation from "./regTranslation.js";

export default {
  getEntity: contrsWrapper(getEntity),
  regTranslation: contrsWrapper(regTranslation),
};
