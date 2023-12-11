import shopify from "../../shopify.js";

const getEntityById = async (req, res) => {
  const { resourceId, locale = "en" } = req.body;

  if (!resourceId) return res.status(400).json({ error: "Invalid id." });

  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const query = `
    query ($resourceId: ID!, $locale: String!) {
      resource: translatableResource(resourceId: $resourceId) {
        resourceId 
        translatableContent { 
          key 
          value 
          digest 
          locale 
        }
        translations(locale: $locale) {
          key
          value
          locale
        }
      }
    }
  `;

  const response = await client.query({
    data: {
      query,
      variables: {
        resourceId,
        locale,
      },
    },
  });

  const { resource } = response.body.data;

  return res.status(200).json(resource);
};

export default getEntityById;
