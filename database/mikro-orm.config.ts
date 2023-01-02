import {Options} from "@mikro-orm/core";
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";

export const DatabaseConfig: Options = {
  type: "mysql",
  host: process.env["DB_HOST"],
  port: Number(process.env["DB_PORT"]),
  user: process.env["DB_USERNAME"],
  password: process.env["DB_PASSWORD"],
  dbName: process.env["DB_DATABASE"],
  metadataProvider: TsMorphMetadataProvider,
  entities: [
    "./entities/**"
  ],
  migrations: {
    path: "./migrations"
  }
  // debug: [
  //   "query", "query-params"
  // ],
};
