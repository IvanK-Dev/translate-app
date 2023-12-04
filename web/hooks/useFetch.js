import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js";

export const useFetch = () => {
  const appFetch = useAuthenticatedFetch();

  const func = async (url, method = "GET", body = null) => {
    try {
      const fetchOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (body) fetchOptions.body = JSON.stringify(body);

      const response = await appFetch(url, fetchOptions);

      if (!response.ok) {
        console.error(`Request failed with status ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    get: async (url) => await func(url, "GET"),
    post: async (url, body) => await func(url, "POST", body),
    put: async (url, body) => await func(url, "PUT", body),
    patch: async (url, body) => await func(url, "PATCH", body),
    delete: async (url) => await func(url, "DELETE"),
  };
};
