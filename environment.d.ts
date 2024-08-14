import { Dialect } from "sequelize";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: string;
      DB_DATABASE: string;
      DB_USER: string;
      DB_PASS: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_CONNECTOR: Dialect;
    }
  }
}

export {};
