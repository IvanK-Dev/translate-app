import contrsWrapper from "../../helpers/contrsWrapper.js";
import countProducts from "./countProducts.js";
import createProduct from "./createProduct.js";
import getAllProducts from "./getAllProducts.js";

export default {
    countProducts: contrsWrapper(countProducts),
    createProduct: contrsWrapper(createProduct),
    getAllProducts: contrsWrapper(getAllProducts)
}