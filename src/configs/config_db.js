import "dotenv/config";

const config_db = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTOR,
};

export default config_db;
