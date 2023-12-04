import shopify from "../../shopify.js";
import { QUERIES } from "../../consts/queries.js";

const getEntity = async (req, res) => {
  const { entity } = req.params;
  const { quantity = 10, cursor = null, direction = "forward" } = req.body;

  if (direction !== "forward" && direction !== "backward")
    return res.status(400).json({
      error: "Invalid direction. Must be 'forward' or 'backward'.",
    });

  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const query = QUERIES[entity](direction);

  const response = await client.query({
    data: {
      query,
      variables: {
        numEntities: quantity,
        cursor,
      },
    },
  });

  return res.status(200).json(response.body.data);
};

export default getEntity;
