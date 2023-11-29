import {
  Page,
  Layout,
  Card,
  Box,
  BlockStack,
  Text,
  InlineStack,
  Button,
  Icon,
} from '@shopify/polaris';
import { ChevronRightMinor } from '@shopify/polaris-icons';
import React from 'react';

function FirstLayout() {
  const data = {
    products: {
      collections: {},
      products: {},
    },
    online_store: {
      blog_posts: {},
      blog_titles: {},
      filters: {},
      metaobjects: {},
    },
  };

  const generateItems = (data) => {
    const keys = Object.keys(data);

    return (
      <>
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <Box
              key={key}
              variant="headingSm"
              as="h2"
              borderColor="border-secondary"
              borderStyle="solid"
              borderBlockEndWidth="025"
              paddingBlockStart={'300'}
              paddingBlockEnd={'300'}
              paddingInlineStart={'400'}
              paddingInlineEnd={'400'}
            >
              {key}
            </Box>
            {Object.keys(data[key]).length > 0
              ? Object.keys(data[key]).map((subKey, index) => (
                  <Box
                    key={`${index} ${subKey}`}
                    borderColor="border-secondary"
                    borderStyle="solid"
                    borderBlockEndWidth="025"
                    paddingBlockStart={'300'}
                    paddingBlockEnd={'300'}
                    paddingInlineStart={'400'}
                    paddingInlineEnd={'400'}
                  >
                    <Button key={subKey} fullWidth textAlign="left">
                      <Box>
                        <InlineStack align="space-between" blockAlign="center">
                          <InlineStack gap={'200'}>
                            <BlockStack gap={'100'}>
                              <Text>{subKey}</Text>
                            </BlockStack>
                          </InlineStack>
                          <Icon tone="base" source={ChevronRightMinor} />
                        </InlineStack>
                      </Box>
                    </Button>
                  </Box>
                ))
              : null}
          </React.Fragment>
        ))}
      </>
    );
  };

  const blockStackItems = generateItems(data);

  return (
    <Box>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">{blockStackItems}</BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card sectioned>
            <h2>English</h2>
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
