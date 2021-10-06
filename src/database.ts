import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  NODE_ENV,
  POSTGRES_HOST: host,
  POSTGRES_DB: database,
  POSTGRES_DB_TEST: testDatabase,
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: password,
} = process.env;

let client: Pool;

if (NODE_ENV === "development") {
  client = new Pool({ host, database, user, password });
} else if (NODE_ENV === "test") {
  client = new Pool({ host, user, password, database: testDatabase });
} else {
  throw new Error("DB Pool not initialized.");
}

export default client;
