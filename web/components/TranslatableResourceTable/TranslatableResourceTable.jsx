import React, { useCallback, useEffect, useRef, useState } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  DataTable,
  InlineStack,
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

  useEffect(() => {
    if (!currentItem.translatableContent) return;
    currentItem.translatableContent.forEach((item) => {
      setValueObj((prevObj) => ({
        ...prevObj,
        [item.key]: "",
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

  const pageTitle = useLocation().pathname.split("/").pop();

  const handleTranslateButton = (key, value) => {
    if (value) {
      console.log("handleTranslateButton", key, value);
      setValueObj((prev) => ({
        ...prev,
        [key]: value.concat(" ", "[Translated]"),
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
            as={"span"}
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
            label={""}
            placeholder=" Input here"
            connectedRight={
              <TranslateButton value={valueObj[item.key]} itemKey={item.key} />
            }
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

  const disabled = useMemo(() => {
    if (!currentItem?.translatableContent) return false;

    return currentItem?.translatableContent?.every((item) => {
      const { key } = item;
      const translation = currentItem?.translations?.find(
        (translation) => translation.key === key
      ) || { value: "" };

      return valueObj[key] === translation.value;
    });
  }, [valueObj, currentItem]);

  return (
    <Page
      backAction={{ url: "/pagename" }}
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
