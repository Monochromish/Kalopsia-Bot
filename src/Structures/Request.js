const requestPromiseNative = require("request-promise-native");

const stringifyError = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error.stack === "string") {
    return error.stack.split(/\s*[\r\n]+\s*/g)[0];
  }

  if (error && error.message) {
    return error.message;
  }

  if (error && error.toJSON) {
    return JSON.stringify(error.toJSON());
  }

  try {
    return JSON.stringify(error);
  } catch (JSONErrorWillBeIgnored) {
    return "Unknown non-string value is thrown.";
  }
};

const MASK = "(Data Masked)";

const maskResponseOr = (maskResponse, data) => {
  if (typeof maskResponse === "function") return maskResponse(data, MASK);
  if (maskResponse && data) return MASK;
  return data;
};

const request = (options) => {
  const { maskResponse, ...restOptions } = options;
  const optionsWithDefault = {
    // timeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 30000,
    timeout: 30000,
    ...restOptions,
  };

  return requestPromiseNative(optionsWithDefault).then(
    (data) => {
      const isProd =
        process.env.NODE_ENV !== "development" && !process.env.IS_DEV_NETWORK;

      const loggingData = maskResponseOr(isProd || maskResponse, data);
      console.info({ sent: optionsWithDefault, received: loggingData });
      return data;
    },
    (error) => {
      console.error({
        sent: optionsWithDefault,
        error: error.cause || stringifyError(error),
      });
      return Promise.reject(error);
    }
  );
};
module.exports = request;
