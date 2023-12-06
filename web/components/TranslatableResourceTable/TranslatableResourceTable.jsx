import React from 'react';
import {
  Box,
  DataTable,
  BlockStack,
  Page,
  InlineStack,
} from '@shopify/polaris';

const TranslatableResourceTable = () => {
  const rows = [
    ['FieldName', 'immutable text', 'mutable text component'],
    ['FieldName', 'immutable text', 'mutable text component'],
    ['FieldName', 'immutable text', <Box>mutable text component</Box>],
  ];

  const columnContentTypes = ['text', 'text', 'text'];
  const headings = ['','PrimaryLanguage', 'Translate Language'];

  return (
    <Page title={'Page Tiitle'}>
        <DataTable
          columnContentTypes={columnContentTypes}
          headings={headings}
          rows={rows}
        />
    </Page>
  );
};

export default TranslatableResourceTable;
