import {
  BlockStack,
  Box,
  Pagination,
  ResourceItem,
  ResourceList,
} from "@shopify/polaris";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ListItem } from "../../components/ListItem/ListItem.jsx";
import { useFetch } from "../../hooks/useFetch.js";

const LocalizePage = () => {
  const [data, setData] = useState({});
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});

  const location = useLocation().pathname.split("/").pop();
  const endpoint = `${location}s`;

  const getItems = useFetch(`/api/${endpoint}`).post;

  useEffect(() => {
    const fetchData = async () => {
      setData(
        await getItems({
          quantity: 10,
          cursor: null,
          direction: "forward",
        })
      );
    };

    fetchData().catch((error) => console.error(error));
  }, []);

  useMemo(() => {
    try {
      const pagination = data[endpoint].pageInfo;

      setPagination(pagination);
    } catch (error) {
      return {};
    }
  }, [data]);

  useMemo(() => {
    try {
      const items = data[endpoint].edges.map(({ node }) => node);

      setItems(items);
    } catch (error) {
      return [];
    }
  }, [data]);

  return (
    <div style={{ height: "100%" }}>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "250px 4fr",
          padding: 0,
          height: "100%",
        }}
      >
        <Box
          style={{
            borderRight: "1px solid #ebebeb",
            height: "100%",
            background: "#fff",
          }}
        >
          <ResourceList
            items={items}
            renderItem={(item) => {
              const { id, title, featuredImage, image } = item;

              return (
                <ResourceItem id={id}>
                  <ListItem
                    title={title}
                    image={featuredImage || image}
                    withImage={
                      endpoint === "products" || endpoint === "collections"
                    }
                  />
                </ResourceItem>
              );
            }}
          />
          <Box padding="400">
            <BlockStack inlineAlign="center">
              <Pagination
                hasNext={pagination.hasNextPage}
                onNext={async () =>
                  setData(
                    await getItems({
                      quantity: 10,
                      cursor: pagination.endCursor,
                      direction: "forward",
                    })
                  )
                }
                hasPrevious={pagination.hasPreviousPage}
                onPrevious={async () =>
                  setData(
                    await getItems({
                      quantity: 10,
                      cursor: pagination.startCursor,
                      direction: "backward",
                    })
                  )
                }
              />
            </BlockStack>
          </Box>
        </Box>
        <Box>Main content</Box>
      </Box>
    </div>
  );
};

export default LocalizePage;
