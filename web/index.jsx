import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import { initI18n } from "./utils/i18nUtils.js";

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById("app")).render(<App />);
});
