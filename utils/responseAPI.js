/**
 * @desc This file contain success and error response for rest api
 */

/**
 * @desc Send any success response
 *
 * @param {string} message
 * @param {object | array} results
 * @param {number} statusCode
 */
exports.success = (message, results, statusCode) => {
  return {
    message,
    code: statusCode,
    error: false,
    results
  };
};

/**
 * @desc Send any error response
 *
 * @param {string} message
 * @param {number} statusCode
 */
exports.error = (message, statusCode) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 403, 404, 422, 500];

  const findCode = codes.find((code) => code === statusCode);
  if (!findCode) {
    statusCode = 500;
  } else {
    statusCode = findCode;
  }

  return {
    message,
    code: statusCode,
    error: true
  };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
exports.validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors
  };
};
