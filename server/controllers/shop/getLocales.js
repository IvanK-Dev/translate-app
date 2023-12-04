import shopify from "../../shopify.js";

const getLocales = async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const query = `
  query {
    shopLocales {
      locale
      primary
      published
    }
  }`;

  const response = await client.query({
    data: {
      query,
    },
  });

  return res.status(200).json(response.body.data.shopLocales);
};

export default getLocales;
