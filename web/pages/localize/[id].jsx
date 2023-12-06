import {
  BlockStack,
  Box,
  InlineStack,
  Pagination,
  ResourceItem,
  ResourceList,
  Text,
  Thumbnail,
} from '@shopify/polaris';
import { ImageMajor } from '@shopify/polaris-icons';
import { useLocation } from 'react-router-dom';
import { useAuthenticatedFetch } from '../../hooks/index.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TranslatableResourceTable from '../../components/TranslatableResourceTable/TranslatableResourceTable.jsx';

const LocalizePage = () => {
  const [data, setData] = useState({});
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});

  const location = useLocation().pathname.split('/').pop();
  const endpoint = `${location}s`;
  const appFetch = useAuthenticatedFetch();

  const getItems = useCallback(
    async (quantity = 10, cursor = null, direction = 'forward') => {
      try {
        const response = await appFetch(`/api/${endpoint}`, {
          method: 'POST',
          body: JSON.stringify({ direction, quantity, cursor }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`Request failed with status ${response.status}`);
          return null;
        }

        return await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    [endpoint, appFetch]
  );

  useEffect(() => {
    const fetchData = async () => {
      setData(await getItems());
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
    <div style={{ height: '100%' }}>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: '250px 4fr',
          padding: 0,
          height: '100%',
        }}
      >
        <Box
          style={{
            borderRight: '1px solid #ebebeb',
            height: '100%',
            background: '#fff',
          }}
        >
          <ResourceList
            items={items}
            renderItem={(item) => {
              const { id, title, featuredImage } = item;

              return (
                <ResourceItem id={id}>
                  <InlineStack wrap={false} gap="300" blockAlign="center">
                    {featuredImage?.url ? (
                      <Thumbnail
                        size="extraSmall"
                        source={featuredImage?.url}
                        alt={featuredImage?.altText}
                      />
                    ) : (
                      <Thumbnail
                        size="extraSmall"
                        source={ImageMajor}
                        alt="Empty Image"
                      />
                    )}
                    <Text as="p" fontWeight="bold">
                      {title}
                    </Text>
                  </InlineStack>
                </ResourceItem>
              );
            }}
          />
          <Box padding="400">
            <BlockStack inlineAlign="center">
              <Pagination
                hasNext={pagination.hasNextPage}
                onNext={async () =>
                  setData(await getItems(10, pagination.endCursor, 'forward'))
                }
                hasPrevious={pagination.hasPreviousPage}
                onPrevious={async () =>
                  setData(
                    await getItems(10, pagination.startCursor, 'backward')
                  )
                }
              />
            </BlockStack>
          </Box>
        </Box>
        <Box>
          <TranslatableResourceTable />
        </Box>
      </Box>
    </div>
  );
};

export default LocalizePage;
