import contrsWrapper from "../../helpers/contrsWrapper.js";
import getShop from "./getShop.js";
import getLocales from "./getLocales.js";

export default {
  getShop: contrsWrapper(getShop),
  getLocales: contrsWrapper(getLocales),
};
