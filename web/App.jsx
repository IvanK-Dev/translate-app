import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigationMenu, useAppBridge } from '@shopify/app-bridge-react';
import Routes from './Routes.jsx';

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from './components/index.js';
import { useDispatch } from 'react-redux';
import { getLocalesThunk } from './redux/locales/localesThunk.js';
import { useEffect } from 'react';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const dispatch = useDispatch();

  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');
  const { t } = useTranslation();

  const app = useAppBridge();

  useEffect(() => {
    (() => {
      dispatch(getLocalesThunk(app));
    })();
  }, [dispatch, app]);

  return (
    <>
      <NavigationMenu
        navigationLinks={[
          {
            label: t('NavigationMenu.pageName'),
            destination: '/pagename',
          },
        ]}
      />
      <Routes pages={pages} />
    </>
  );
}
