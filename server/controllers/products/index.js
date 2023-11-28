import contrsWrapper from "../../helpers/contrsWrapper.js";
import countProducts from "./countProducts.js";
import createProduct from "./createProduct.js";

export default {
    countProducts: contrsWrapper(countProducts),
    createProduct: contrsWrapper(createProduct)
}