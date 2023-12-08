import React, { useCallback, useRef, useState } from 'react';
import {
  BlockStack,
  Box,
  DataTable,
  Page,
  SkeletonTabs,
  Spinner,
  Text,
  TextField,
} from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import { languages } from '../../constants/languages';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import TextEditor from '../TinyMceElement/TextEditor';

const TranslatableResourceTable = ({ currentItem }) => {
  const [valueObj, setValueObj] = useState({});
  const capitalizeFirstLetter = useCallback(
    (str) => str.charAt(0).toUpperCase() + str.slice(1),
    []
  );

  const handleChange = useCallback((key, newValue) => {
    const obj = JSON.parse(JSON.stringify(valueObj));
    obj[key] = newValue;
    setValueObj(obj);
  }, []);


  const pageTitle = useLocation().pathname.split('/').pop();

  const rows = useCallback(() => {
    if (currentItem.translatableContent) {
      return currentItem.translatableContent.map((item) => [
        capitalizeFirstLetter(item.key.trim()),
        <Box>
          <Text alignment="start" tone="subdued" className="break-word">
            {item.value}
          </Text>
        </Box>,
        item.key.trim().includes('html') ? (
          <TextEditor />
        ) : (
          <TextField
            value={valueObj[item.key]&&''}
            onChange={(value) => handleChange(item.key, value)}
            autoComplete="off"
          />
        ),
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
        <Box maxWidth="100%">
          <DataTable
            columnContentTypes={columnContentTypes}
            headings={headings}
            rows={rows()}
            truncate={false}
          />
        </Box>
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
