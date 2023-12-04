import contrsWrapper from "../../helpers/contrsWrapper.js";
import countProducts from "./countProducts.js";
import createProduct from "./createProduct.js";
import getProducts from "./getProducts.js";
import getAllProducts from "./getAllProducts.js";

export default {
    countProducts: contrsWrapper(countProducts),
    createProduct: contrsWrapper(createProduct),
    getProducts: contrsWrapper(getProducts),
    getAllProducts: contrsWrapper(getAllProducts)
}