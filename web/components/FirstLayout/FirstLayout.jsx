import {
  Layout,
  Card,
  Box,
  BlockStack,
  Text,
  InlineStack,
  Icon,
  Divider,
  Badge,
} from '@shopify/polaris';
import { ChevronRightMinor } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './FirstLayout.module.css';
import { languages } from '../../constants';
import { useAppBridge, useNavigate } from '@shopify/app-bridge-react';
import LanguageSelector from './LanguageSelector/LanguageSelector';
import { useDispatch } from 'react-redux';
import { getLocalesThunk } from '../../redux/locales/localesThunk';
import { selectLocalesArray } from '../../redux/locales/localesSelectors.js';
import { useSelector } from 'react-redux';

function FirstLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const app = useAppBridge();

  useEffect(() => {
    (() => {
      dispatch(getLocalesThunk(app));
    })();
  }, [dispatch, app]);

  const locales = useSelector(selectLocalesArray);

  const primaryLocale = useMemo(() => {
    return locales.find((item) => item.primary)?.locale;
  }, [locales]);

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
    Settings: ['Notifications', 'Shipping and delivery'],
  };

  const generateItems = useCallback(
    (data) => {
      const keys = Object.keys(buttonData);

      const handleOnClick = (str) => {
        str = str
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/s$/, '')
          .replace(/ie$/, 'y');
        navigate(`/localize/${str}`);
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
              {buttonData[key].length > 0
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
    },
    [buttonData, navigate]
  );

  const blockStackItems = generateItems(buttonData);

  return (
    <Box>
      <Box paddingBlockStart={'300'} paddingBlockEnd={'300'}>
        <BlockStack inlineAlign="center">
          {locales.length > 0 && <LanguageSelector />}
        </BlockStack>
      </Box>
      <Layout>
        <Layout.Section>
          <BlockStack>{blockStackItems}</BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card sectioned>
            <h2>
              {languages[primaryLocale]} <Badge>Default</Badge>{' '}
            </h2>
            <p>
              Your default language is visible to all customers. Versions
              customized for markets are only visible to customers in those
              markets.
            </p>
          </Card>
          {/* <Card sectioned>
            <h2>Get started guide</h2>
            <p>
              Learn all about content localization with our quick start guide.
            </p>
          </Card> */}
        </Layout.Section>
      </Layout>
    </Box>
  );
}

export default FirstLayout;
