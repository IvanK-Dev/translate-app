import React, { useCallback } from 'react';
import {
    BlockStack,
  Box,
  Button,
  DataTable,
  Page,
  SkeletonTabs,
  Spinner,
  Text,
} from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import { languages } from '../../constants/languages';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const TranslatableResourceTable = ({ currentItem }) => {
  const capitalizeFirstLetter = useCallback(
    (str) => str.charAt(0).toUpperCase() + str.slice(1),
    []
  );

  const pageTitle = useLocation().pathname.split('/').pop();

  const rows = useCallback(() => {
    if (currentItem.translatableContent) {
      return currentItem.translatableContent.map((item) => [
        capitalizeFirstLetter(item.key.trim()),
        <Box>
          <Text alignment="start" tone="subdued">
            {item.value}
          </Text>
        </Box>,
        '',
      ]);
    }
  }, [currentItem]);

  const columnContentTypes = ['text', 'text', 'text'];

  const headings = [
    '',
    <Box>
      <Text alignment="center" tone="subdued">
        Primary language
      </Text>
      <Text alignment="center" tone="subdued" variant="bodyLg">
        {'Language' &&
          currentItem.translatableContent &&
          languages[currentItem.translatableContent.at(0).locale]}
      </Text>
    </Box>,

    <Box>
      <Text alignment="center">Translate language</Text>
      <BlockStack inlineAlign="center">
        <LanguageSelector />
      </BlockStack>
    </Box>,
  ];

  return (
    <Page title={capitalizeFirstLetter(pageTitle)}>
      {currentItem.translatableContent ? (
        <DataTable
          columnContentTypes={columnContentTypes}
          headings={headings}
          rows={rows()}
          truncate={false}
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
