import { Card, Page, Layout, TextContainer, Text } from '@shopify/polaris';
import { Loading, TitleBar } from '@shopify/app-bridge-react';
import { useTranslation } from 'react-i18next';
import FirstLayout from '../components/FirstLayout/FirstLayout';
import { useAppQuery } from '../hooks';
import { STATUS } from '../constants';
import { useState } from 'react';

export default function PageName() {
  const [status, setStatus] = useState(STATUS.idle);
  const { t } = useTranslation();

  const shop = useAppQuery({
    url: '/api/shop',
    reactQueryOptions: {
      onSuccess: () => {
        setStatus(STATUS.success);
      },
    },
  });

  return status === STATUS.success ? (
    <Page>
      <TitleBar
        title={shop.data[0].name}
        primaryAction={{
          content: t('PageName.primaryAction'),
          onAction: () => console.log('Primary action'),
        }}
        secondaryActions={[
          {
            content: t('PageName.secondaryAction'),
            onAction: () => console.log('Secondary action'),
          },
        ]}
      />
      <FirstLayout shop={shop}/>
    </Page>
  ) : (
    <Loading />
  );
}
