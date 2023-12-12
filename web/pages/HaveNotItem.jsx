import { Card, Page, Text } from '@shopify/polaris';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const HaveNotItem = () => {
  const pageTitle = useLocation().pathname.split('/').pop();

  const capitalizeFirstLetter = useCallback(
    (str) => str.charAt(0).toUpperCase() + str.slice(1),
    []
  );

  return (
    <Page
      backAction={{ url: '/pagename' }}
      title={capitalizeFirstLetter(pageTitle)}
    >
      <Card>
        <Text>You have no fields to display</Text>
      </Card>
    </Page>
  );
};
export default HaveNotItem;
