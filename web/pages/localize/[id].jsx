import {
  BlockStack,
  Box,
  Pagination,
  ResourceItem,
  ResourceList,
  SkeletonBodyText,
  Spinner,
} from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import TranslatableResourceTable from '../../components/TranslatableResourceTable/TranslatableResourceTable.jsx';
import { ListItem } from '../../components/ListItem/ListItem.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { ActiveLabel } from '../../components/ActiveLabel/ActiveLabel.jsx';

import css from '../../components/Spinner.module.css';
import HaveNotItem from '../HaveNotItem.jsx';

const LocalizePage = () => {
  const [data, setData] = useState({});
  const [items, setItems] = useState(Array(10));
  const [pagination, setPagination] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation().pathname.split('/').pop();
  const endpoint = `${location}`;
  const url = `/api/entities/${endpoint}`;

  const getItems = useFetch().post;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const newData = await getItems(url, {
        quantity: 10,
        cursor: null,
        direction: 'forward',
      });

      setData(newData);
    };

    fetchData()
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useMemo(() => {
    try {
      setLoading(true);
      const pagination = data?.pageInfo;
      const items = data?.edges.map(({ node }) => node);

      setCurrentId(items[0]?.resourceId || '');
      setPagination(pagination);
      setItems(items);
    } catch (error) {
      return {};
    } finally {
      setLoading(false);
    }
  }, [data]);

  return loading ? (
    <div className={css.spinner}>
      <Spinner />
    </div>
  ) : (
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
              const { resourceId: id, image = '' } = item;
              const { value: title } = item?.translatableContent?.find(
                (content) =>
                  content?.key === 'title' ||
                  content?.key === 'label' ||
                  content?.key === 'meta_title' ||
                  content?.key === 'name'
              ) || { value: '' };
              const active = currentId === id;

              return (
                <ResourceItem
                  id={id}
                  onClick={() => setCurrentId(item?.resourceId)}
                  style={{ position: 'relative' }}
                >
                  {active && <ActiveLabel />}
                  <ListItem
                    title={
                      endpoint === 'store_metadata' ? 'Meta content' : title
                    }
                    image={image}
                    withImage={
                      endpoint === 'product' || endpoint === 'collection'
                    }
                  />
                </ResourceItem>
              );
            }}
          />
          {(pagination?.hasNextPage || pagination?.hasPreviousPage) && (
            <Box padding="400">
              <BlockStack inlineAlign="center">
                <Pagination
                  hasNext={pagination.hasNextPage}
                  onNext={async () =>
                    setData(
                      await getItems(url, {
                        quantity: 10,
                        cursor: pagination.endCursor,
                        direction: 'forward',
                      })
                    )
                  }
                  hasPrevious={pagination.hasPreviousPage}
                  onPrevious={async () =>
                    setData(
                      await getItems(url, {
                        quantity: 10,
                        cursor: pagination.startCursor,
                        direction: 'backward',
                      })
                    )
                  }
                />
              </BlockStack>
            </Box>
          )}
        </Box>
        <Box style={{ overflow: 'auto' }}>
          {currentId ? (
            <TranslatableResourceTable currentId={currentId} />
          ) : (
            <HaveNotItem />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default LocalizePage;
