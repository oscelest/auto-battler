import {MikroORM} from "@mikro-orm/core";
import {DatabaseConfig} from "./mikro-orm.config";
import {Database} from "./modules/Database";

export * from "./entities";

export default (async () => {
  const orm = await MikroORM.init(DatabaseConfig);
  await Database.migrate(orm);
  
  process.exit();
})();
