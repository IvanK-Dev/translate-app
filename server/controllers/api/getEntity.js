import shopify from "../../shopify.js";

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

  const queryDirection =
    direction === "forward"
      ? "(first: $numEntities, after: $cursor)"
      : "(last: $numEntities, before: $cursor)";

  const query = `
      query ($numEntities: Int!, $cursor: String) {
        ${entity}${queryDirection} {
          edges {
            node {
              id
              title
              ${entity === "products" ? "featuredImage" : "image"} {
                altText
                url
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;

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
