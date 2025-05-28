const expressRateLimit = require("express-rate-limit");
const message = require("../utils/messages");

const rateLimitMiddleware = (
  options = { duration: 60 * 1000, limit: 1000, customMsg: "" }
) => {
  const { duration, limit, customMsg } = options;
  const windowMs =
    Number.isInteger(duration) && duration > 0 ? duration : 60 * 1000; // Ensure valid window (default to 1 minute)
  const max = Number.isInteger(limit) && limit > 0 ? limit : 1000; // Ensure valid limit (default to 1000 requests)
  const msg = customMsg ? customMsg : message.RATE_LIMIT_MESSAGE;
  return expressRateLimit({
    windowMs: windowMs, // Rate limit window in milliseconds
    max: max, // Maximum allowed requests per IP within the window
    message: async (req, res) => {
      return res.json({
        status: 429,
        message: msg,
      });
    },
    keyGenerator: (req) => {
      const apiEndpoint = req.originalUrl.split("/")[2];
      return `<span class="math-inline">${apiEndpoint}:</span>{req.ip}`;
    },
  });
};

module.exports = rateLimitMiddleware;
