import shopify from "../../shopify.js";

const getProducts = async (req, res) => {
  const { quantity = 10, cursor = null, direction = "forward" } = req.body;

  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const queryDirection =
      direction === "forward"
        ? "(first: $numProducts, after: $cursor)"
        : "(last: $numProducts, before: $cursor)";

    const query = `
      query ($numProducts: Int!, $cursor: String) {
        products${queryDirection} {
          edges {
            node {
              id
              title
              featuredImage {
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
          numProducts: quantity,
          cursor,
        },
      },
    });

    res.status(200).json(response.body.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getProducts;
