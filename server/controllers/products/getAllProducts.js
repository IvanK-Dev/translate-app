import shopify from "../../shopify.js";

const getAllProducts = async (_req, res) => {
  const countData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
};

export default getAllProducts;