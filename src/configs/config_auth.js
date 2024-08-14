import "dotenv/config";

const config_auth = {
  prefitHash: process.env.AUTH_PREFIT_HASH,
  secretKey: process.env.AUTH_SECRET_KEY,
  secretBase64: process.env.AUTH_SECRET_BASE64,
  expiresInApp: process.env.AUTH_EXPIRES_IN_APP,
  expiresInWeb: process.env.AUTH_EXPIRES_IN_WEB,
};

export default config_auth;
