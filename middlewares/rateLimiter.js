import NodeCache from "node-cache";

const loginAttemptsCache = new NodeCache();
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 1000 * 60 * 15; // 15 minutes

export const rateLimitLoginAttempts = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { email } = req.body;
  const cacheKey = `loginAttempts:${email}_${ip}`;
  console.log("Rate limiter", cacheKey, email, ip);

  const data = loginAttemptsCache.get(cacheKey);
  if (data && data.blocked) {
    const remainingTime = Math.ceil((data.expiresAt - Date.now()) / 1000);
    return res.status(429).json({
      status: "error",
      message: `Too many login attempts. Please try again in ${remainingTime} seconds`,
      errors: [
        {
          field: "email",
          message: `Too many login attempts. Please try again in ${remainingTime} seconds`,
        },
      ],
      data: { remainingTime },
    });
  }
  req.cacheKey = { cacheKey, ip, data };
  next();
};
