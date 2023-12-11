import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BlockStack,
  Box,
  Button,
  DataTable,
  Page,
  SkeletonTabs,
  Spinner,
  Text,
  TextField,
} from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import { languages } from '../../constants/index.js';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import TextEditor from '../TinyMceElement/TextEditor';
import { useSelector } from 'react-redux';
import {
  selectActiveLocale,
  selectLocalesArray,
} from '../../redux/locales/localesSelectors';
import { useFetch } from '../../hooks/useFetch.js';

import css from './TranslatableResourceTable.module.css';

const TranslatableResourceTable = ({ currentId }) => {
  const [valueObj, setValueObj] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const appFetch = useFetch();

  const activeLocale = useSelector(selectActiveLocale);
  const language = useSelector(selectLocalesArray).find(({ active }) => active);

  useEffect(() => {
    if (!currentId) return;
    const getEntity = async () => {
      const response = await appFetch.post(`/api/entity/`, {
        resourceId: currentId,
        locale: activeLocale?.locale,
      });
      setCurrentItem(response);
    };

    getEntity().catch((error) => console.error(error));
  }, [currentId, activeLocale]);

  useEffect(() => {
    if (language) {
      setValueObj((prevObj) => ({ ...prevObj, locale: language.locale }));
    }
  }, [language]);

  useEffect(() => {
    if (!currentItem?.translatableContent) return;
    currentItem.translatableContent.forEach((item) => {
      setValueObj((prevObj) => ({
        ...prevObj,
        [item.key]: '',
      }));
    });

    if (!currentItem.translations) return;
    currentItem.translations.forEach((item) => {
      setValueObj((prevObj) => ({
        ...prevObj,
        [item.key]: item.value,
      }));
    });
  }, [currentItem]);

  const capitalizeFirstLetter = useCallback(
    (str) => str.charAt(0).toUpperCase() + str.slice(1),
    []
  );

  const handleChange = useCallback((key, newValue) => {
    setValueObj((prev) => ({ ...prev, [key]: newValue }));
  }, []);

  const pageTitle = useLocation().pathname.split('/').pop();

  const handleTranslateButton = (key, value) => {
    if (value) {
      console.log('handleTranslateButton', key, value);
      setValueObj((prev) => ({
        ...prev,
        [key]: value.concat(' ', '[Translated]'),
      }));
    }
  };

  const TranslateButton = ({ itemKey, value }) => (
    <Button onClick={() => handleTranslateButton(itemKey, value)}>
      Translate
    </Button>
  );

  const rows = useCallback(() => {
    if (currentItem.translatableContent) {
      return currentItem.translatableContent.map((item) => [
        capitalizeFirstLetter(item.key.trim()),
        <Box>
          <Text
            as={'span'}
            alignment="start"
            tone="subdued"
            className="break-word"
          >
            {item.value}
          </Text>
        </Box>,
        item.key.trim().includes('html') ? (
          <TextEditor />
        ) : (
          <TextField
            value={valueObj[item.key]}
            onChange={(value) => handleChange(item.key, value)}
            autoComplete="off"
            label={''}
            placeholder=" Input here"
            connectedRight={
              <TranslateButton value={valueObj[item.key]} itemKey={item.key} />
            }
          />
        ),
      ]);
    }
  }, [currentItem, valueObj]);

  const columnContentTypes = ['text', 'text', 'text'];

  const headings = [
    '',
    <Box>
      <Text as={'span'} alignment="center" tone="subdued">
        Primary language
      </Text>
      <Text as={'span'} alignment="center" tone="subdued" variant="bodyLg">
        {'Language' &&
          currentItem?.translatableContent &&
          languages[currentItem?.translatableContent?.at(0).locale]}
      </Text>
    </Box>,

    <Box>
      <Text as={'span'} alignment="center">
        Translate language
      </Text>
      <BlockStack inlineAlign="center">
        <LanguageSelector />
      </BlockStack>
    </Box>,
  ];

  const handleSave = useCallback(() => {
    const { resourceId, translatableContent } = currentItem;
    const { locale } = valueObj;

    const payload = {
      resourceId,
      translations: translatableContent.reduce((acc, item) => {
        const { key, digest } = item;
        const translation = valueObj[key];
        if (translation) {
          acc.push({
            locale,
            key,
            value: translation,
            translatableContentDigest: digest,
          });
        }
        return acc;
      }, []),
    };

    if (payload.translations.length === 0) return;

    appFetch /// переписать в Thank в redux или ввести спинер
      .post('/api/translate', payload)
      .then((response) => {
        const newTranslations = response?.translationsRegister?.translations;

        const updatedTranslations = currentItem?.translations?.map((item) => {
          const newTranslation = newTranslations?.find(
            (translation) => translation.key === item.key
          );
          return newTranslation || item;
        });

        setCurrentItem((prev) => ({
          ...prev,
          translations: updatedTranslations,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [valueObj, appFetch]);

  const disabled = useMemo(() => {
    if (!currentItem?.translatableContent) return false;

    return currentItem?.translatableContent?.every((item) => {
      const { key } = item;
      const translation = currentItem?.translations?.find(
        (translation) => translation.key === key
      ) || { value: '' };

      return valueObj[key] === translation.value;
    });
  }, [valueObj, currentItem]);

  return (
    <Page
      backAction={{ url: '/pagename' }}
      title={capitalizeFirstLetter(pageTitle)}
      primaryAction={
        <Button
          disabled={disabled}
          variant="primary"
          onClick={() => handleSave()}
        >
          Save
        </Button>
      }
    >
      {currentItem?.translatableContent ? (
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
          <div className={css.spinner}>
            <Spinner />
          </div>
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
