import { Page } from '@shopify/polaris';
import { Loading } from '@shopify/app-bridge-react';
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
      <FirstLayout shop={shop} />
    </Page>
  ) : (
    <Loading />
  );
}
