import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@shopify/polaris";
import { useLocation } from "react-router-dom";
import { languages } from "../../constants/index.js";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import TextEditor from "../TinyMceElement/TextEditor";
import { useSelector } from "react-redux";
import { selectLocalesArray } from "../../redux/locales/localesSelectors";
import { useFetch } from "../../hooks/useFetch.js";

const TranslatableResourceTable = ({ currentItem }) => {
  const [valueObj, setValueObj] = useState({});
  const appFetch = useFetch();

  const language = useSelector(selectLocalesArray).find(({ active }) => active);

  useEffect(() => {
    if (language) {
      setValueObj((prevObj) => ({ ...prevObj, locale: language.locale }));
    }
  }, [language]);

  const capitalizeFirstLetter = useCallback(
    (str) => str.charAt(0).toUpperCase() + str.slice(1),
    []
  );

  const handleChange = useCallback((key, newValue) => {
    setValueObj((prev) => ({ ...prev, [key]: newValue }));
  }, []);

  const pageTitle = useLocation().pathname.split("/").pop();

  const rows = useCallback(() => {
    if (currentItem.translatableContent) {
      return currentItem.translatableContent.map((item) => [
        capitalizeFirstLetter(item.key.trim()),
        <Box>
          <Text
            as={"span"}
            alignment="start"
            tone="subdued"
            className="break-word"
          >
            {item.value}
          </Text>
        </Box>,
        item.key.trim().includes("html") ? (
          <TextEditor />
        ) : (
          <TextField
            value={valueObj[item.key]}
            onChange={(value) => handleChange(item.key, value)}
            autoComplete="off"
            label={""}
          />
        ),
      ]);
    }
  }, [currentItem, valueObj]);

  const columnContentTypes = ["text", "text", "text"];

  const headings = [
    "",
    <Box>
      <Text as={"span"} alignment="center" tone="subdued">
        Primary language
      </Text>
      <Text as={"span"} alignment="center" tone="subdued" variant="bodyLg">
        {"Language" &&
          currentItem.translatableContent &&
          languages[currentItem.translatableContent.at(0).locale]}
      </Text>
    </Box>,

    <Box>
      <Text as={"span"} alignment="center">
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

    appFetch.post("/api/translate", payload).catch((error) => {
      console.log(error);
    });
  }, [valueObj, appFetch]);

  // const disabled = useMemo(
  //   () =>
  //     currentItem?.translatableContent?.every((translation) => {
  //       const { key, value, locale } = translation;
  //       const translationValue = valueObj[key];
  //       return translationValue === value && locale !== valueObj?.locale;
  //     }),
  //   [valueObj, currentItem]
  // );
  //
  // console.log(disabled);
  // console.log(valueObj);
  // console.log(currentItem?.translatableContent);

  return (
    <Page
      title={capitalizeFirstLetter(pageTitle)}
      primaryAction={
        <Button disabled={false} variant="primary" onClick={() => handleSave()}>
          Save
        </Button>
      }
    >
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
