import React, { useCallback } from 'react';
import {
  Box,
  Button,
  DataTable,
  Page,
  SkeletonTabs,
  Spinner,
  Text,
} from '@shopify/polaris';
import { useLocation } from 'react-router-dom';

const TranslatableResourceTable = ({ currentItem }) => {
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const pageTitle = useLocation().pathname.split('/').pop();

  const rows =useCallback( () => {
    if (currentItem.translatableContent) {
      return currentItem.translatableContent.map((item) => [
        capitalizeFirstLetter(item.key.trim()),
        item.value,
        '',
      ]);
    }
  },[currentItem]);

  const columnContentTypes = ['text', 'text', 'text'];

  const headings = [
    '',
    <Box>
      <Text>PrimaryLanguage</Text>
      <Text>PrimaryLanguage</Text>
    </Box>,

    <Box>
      <Text>Translate Language</Text>
      <Button />
    </Box>,
  ];

  return (
    <Page title={capitalizeFirstLetter(pageTitle)}>
      {currentItem.translatableContent ? (
        <DataTable
          columnContentTypes={columnContentTypes}
          headings={headings}
          rows={rows()}
        />
      ) : (
        <>
          <Spinner />
          <SkeletonTabs count={2} />
          <SkeletonTabs count={2} />
          <SkeletonTabs count={2} />
          <SkeletonTabs count={2} />
        </>
      )}
    </Page>
  );
};

export default TranslatableResourceTable;
