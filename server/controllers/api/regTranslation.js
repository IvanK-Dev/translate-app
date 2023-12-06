import shopify from "../../shopify.js";

const regTranslation = async (req, res) => {
  const { resourceId = "", translations = [] } = req.body;

  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const query = `
    mutation translationsRegister($resourceId: ID!, $translations: [TranslationInput!]!) {
      translationsRegister(resourceId: $resourceId, translations: $translations) {
        userErrors {
          message
          field
        }
        translations {
          key
          value
        }
      }
    }
  `;

  const response = await client.query({
    data: {
      query,
      variables: {
        resourceId,
        translations,
      },
    },
  });

  return res.status(201).json(response.body.data);
};

export default regTranslation;
