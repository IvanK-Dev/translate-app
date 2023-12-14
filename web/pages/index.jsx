import {
  Card,
  Page,
  Layout,
} from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";


import { ProductsCard } from "../components/index.js";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
