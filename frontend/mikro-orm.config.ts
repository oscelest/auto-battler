import {Options} from "@mikro-orm/core";
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";
import * as fs from "fs";

const DBConfig: Options = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_DATABASE,
  metadataProvider: TsMorphMetadataProvider,
  discovery: {disableDynamicFileAccess: true},
  // entities: getEntities(),
  migrations: {
    path: "./api/migrations"
  }
  // debug: [
  //   "query", "query-params"
  // ],
};

export async function config() {
  return {
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_DATABASE,
    metadataProvider: TsMorphMetadataProvider,
    discovery: {disableDynamicFileAccess: true},
    entities: await getEntities(),
    migrations: {
      path: "./api/migrations"
    }
  } as Options;
}

async function getEntities(): Promise<any[]> {
  if (process.env.WEBPACK) {
    const modules = (require as any).context("./api/entities", true, /\.ts$/);
    
    return modules
    .keys()
    .map((r: any) => modules(r))
    .flatMap((mod: any) => Object.keys(mod).map(className => mod[className]));
  }
  
  const promises = fs.readdirSync("./api/entities").reduce((result, file) => {
    if (file !== "index.ts") result.push(import(`./database/entities/${file}`));
    return result;
  }, [] as Promise<string>[]);
  const modules = await Promise.all(promises);
  
  console.log(modules);
  
  return modules.flatMap((mod: any) => Object.keys(mod).map(className => mod[className]));
}

export default DBConfig;
