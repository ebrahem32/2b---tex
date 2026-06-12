(function () {
  function createBackendClient(options = {}) {
    const baseUrl = options.baseUrl || '/api';
    const defaultHeaders = options.defaultHeaders || { 'Content-Type': 'application/json' };

    function apiUrl(path) {
      return `${baseUrl}${path}`;
    }

    async function parseJsonResponse(response) {
      return response.json();
    }

    async function errorMessageFromResponse(response) {
      let message = `Backend ${response.status}`;
      try {
        const data = await response.json();
        message = data.error || data.message || message;
      } catch {}
      return message;
    }

    async function request(path, requestOptions = {}) {
      const response = await fetch(apiUrl(path), {
        ...requestOptions,
        headers: { ...defaultHeaders, ...(requestOptions.headers || {}) },
      });
      if (!response.ok) {
        throw new Error(await errorMessageFromResponse(response));
      }
      return parseJsonResponse(response);
    }

    function jsonBody(payload) {
      return JSON.stringify(payload);
    }

    function get(path, requestOptions = {}) {
      return request(path, { ...requestOptions, method: requestOptions.method || 'GET' });
    }

    function post(path, payload, requestOptions = {}) {
      return request(path, { ...requestOptions, method: 'POST', body: jsonBody(payload) });
    }

    function put(path, payload, requestOptions = {}) {
      return request(path, { ...requestOptions, method: 'PUT', body: jsonBody(payload) });
    }

    function del(path, requestOptions = {}) {
      return request(path, { ...requestOptions, method: 'DELETE' });
    }

    return {
      baseUrl,
      apiUrl,
      request,
      get,
      post,
      put,
      delete: del,
    };
  }

  window.createBackendClient = createBackendClient;
}());
