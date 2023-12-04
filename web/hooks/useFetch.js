import { useAuthenticatedFetch } from "./useAuthenticatedFetch.js";

export const useFetch = (url) => {
  const appFetch = useAuthenticatedFetch();

  const func = async (method = "GET", body) => {
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
    get: async (body) => await func(body),
    post: async (body) => await func("POST", body),
    put: async (body) => await func("PUT", body),
    patch: async (body) => await func("PATCH", body),
    delete: async (body) => await func("DELETE", body),
  };
};
