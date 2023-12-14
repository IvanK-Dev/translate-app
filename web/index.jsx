import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { initI18n } from './utils/i18nUtils.js';
import { store } from './redux/store.js';
import {
  AppBridgeProvider,
  PolarisProvider,
  QueryProvider,
} from './components/index.js';
import { BrowserRouter } from 'react-router-dom';

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById('app')).render(
    <Provider store={store}>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <App />
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </Provider>
  );
});
