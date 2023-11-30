import shopify from "../../shopify.js";

const getShop = async (_req, res) => {
  const {data} = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
    fields:['name','primary_locale','domain']
  });
  res.status(200).send(data);
}

export default getShop;