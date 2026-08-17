(function () {
  function createPersistenceWriter(deps = {}) {
    const {
      request,
      isAvailable = () => false,
      markUnavailable = () => {},
      logger = console,
      retryDelayMs = 350,
    } = deps;

    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function retryableError(error) {
      return error?.retryable === true || !Number(error?.status);
    }

    async function requestWithRetry(path, options = {}, attempts = 2) {
      let lastError = null;
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          return await request(path, options);
        } catch (error) {
          lastError = error;
          if (attempt >= attempts || !retryableError(error)) throw error;
          await pause(retryDelayMs * attempt);
        }
      }
      throw lastError;
    }

    async function post(path, payload, options = {}) {
      const strict = options.strict === true;
      if (!isAvailable()) {
        if (strict) throw new Error('قاعدة البيانات غير متصلة الآن.');
        return null;
      }
      try {
        return await requestWithRetry(path, { method: 'POST', body: JSON.stringify(payload) });
      } catch (error) {
        if (strict) throw error;
        markUnavailable(error);
        logger.warn('Backend write failed, kept LocalStorage copy', error);
        return null;
      }
    }

    async function write(method, path, payload, logLabel) {
      if (!isAvailable()) return null;
      try {
        const options = { method };
        if (payload !== undefined) options.body = JSON.stringify(payload);
        return await request(path, options);
      } catch (error) {
        markUnavailable(error);
        logger.warn(logLabel, error);
        return null;
      }
    }

    return {
      retryableError,
      requestWithRetry,
      post,
      put: (path, payload) => write('PUT', path, payload, 'Backend update failed, kept LocalStorage copy'),
      delete: (path) => write('DELETE', path, undefined, 'Backend delete failed, kept LocalStorage copy'),
      saveSetting: (key, value) => write('PUT', `/settings/${key}`, { value }, `Backend setting save failed: ${key}`),
    };
  }

  window.createPersistenceWriter = createPersistenceWriter;
}());
