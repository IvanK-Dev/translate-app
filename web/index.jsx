import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { initI18n } from './utils/i18nUtils.js';
import { store } from './redux/store.js';

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById('app')).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
