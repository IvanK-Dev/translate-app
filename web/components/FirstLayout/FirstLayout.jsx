import {
  Layout,
  Card,
  Box,
  BlockStack,
  Text,
  InlineStack,
  Icon,
  Divider,
} from '@shopify/polaris';
import { ChevronRightMinor } from '@shopify/polaris-icons';
import React from 'react';

import './FirstLayout.module.css';
import { useAppQuery } from '../../hooks';
import {languages} from '../../constants'

function FirstLayout({shop}) {

  const buttonData = {
    Products: ['Collections', 'Products'],
    'Online Store': [
      'Blog posts',
      'Blog titles',
      'Filters',
      'Metaobjects',
      'Navigation',
      'Pages',
      'Policies',
      'Store metadata',
    ],
    Theme: [
      'App embeds',
      'Default theme content',
      'Section groups',
      'Static sections',
      'Templates',
      'Theme settings',
    ],
    Settings: ['Notifications', 'Shipping and delivery'],
  };

  const generateItems = (data) => {
    const keys = Object.keys(buttonData);

    const handleOnClick = (path) => {
      console.log('path', path);
    };

    return (
      <>
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <Box
              key={key}
              as="h2"
              background="bg-surface-secondary"
              borderColor="border-secondary"
              borderStyle="solid"
              borderBlockEndWidth="025"
              paddingBlockStart={'300'}
              paddingBlockEnd={'300'}
              paddingInlineStart={'400'}
              paddingInlineEnd={'400'}
            >
              <Text variant="headingSm">{key}</Text>
            </Box>
           { buttonData[key].length > 0
              ? buttonData[key].map((subKey, index) => (
                  <button
                    type="button"
                    key={`${index} ${subKey}`}
                    onClick={() => handleOnClick(subKey)}
                  >
                    <Box padding={{ xs: '400' }}>
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                        wrap="nowrap"
                      >
                        <InlineStack>
                          <Box>
                            <Text>{subKey}</Text>
                          </Box>
                        </InlineStack>
                        <Icon
                          source={ChevronRightMinor}
                          tone="base"
                          style={{ margin: 0 }}
                        />
                      </InlineStack>
                    </Box>
                    <Divider />
                  </button>
                ))
              : null}
          </React.Fragment>
        ))}
      </>
    );
  };

  const blockStackItems = generateItems(buttonData);

  return (
    <Box>
      <Layout>
        <Layout.Section>
          <BlockStack>{blockStackItems}</BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card sectioned>
            { <h2>{languages[`${shop.data[0].primary_locale}`]}</h2>}
            <p>
              Your default language is visible to all customers. Versions
              customized for markets are only visible to customers in those
              markets.
            </p>
          </Card>
          <Card sectioned>
            <h2>Get started guide</h2>
            <p>
              Learn all about content localization with our quick start guide.
            </p>
          </Card>
        </Layout.Section>
      </Layout>
    </Box>
  );
}

export default FirstLayout;
