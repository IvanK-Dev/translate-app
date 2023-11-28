import shopify from "../../shopify.js";

const countProducts = async (_req, res) => {
    const countData = await shopify.api.rest.Product.count({
        session: res.locals.shopify.session,
    });
    res.status(200).send(countData);
}

export default countProducts;