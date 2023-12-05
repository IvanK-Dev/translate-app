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

  const { resources, images } = response.body.data;
  const combinedData = {
    edges: resources.edges.map((resource) => {
      const resourceId = resource.node.resourceId;
      const imageNode = images?.edges.find((img) => img.node.id === resourceId);
      const image = imageNode?.node.featuredImage || imageNode?.node.image;

      return {
        node: {
          resourceId: resourceId,
          translatableContent: resource.node.translatableContent,
          image: image || null,
        },
      };
    }),
    pageInfo: resources.pageInfo, // Include the pageInfo from resourcesData
  };

  return res.status(200).json(combinedData);
};

export default getEntity;
