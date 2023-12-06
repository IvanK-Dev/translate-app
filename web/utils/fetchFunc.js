import { authenticatedFetch } from "@shopify/app-bridge/utilities";

const fetchFunc = (app) => {
  const fetch = async (url, method, body = null) => {
    try {
      const fetchOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (body) fetchOptions.body = JSON.stringify(body);

      const response = await authenticatedFetch(app)(url, fetchOptions);

      if (!response.ok) {
        console.error(`Request failed with status ${response.status}`);
        return null;
      }

      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    get: (url) => fetch(url, "GET"),
    post: (url, body) => fetch(url, "POST", body),
    put: (url, body) => fetch(url, "PUT", body),
    patch: (url, body) => fetch(url, "PATCH", body),
    delete: (url) => fetch(url, "DELETE"),
  };
};

export default fetchFunc;
