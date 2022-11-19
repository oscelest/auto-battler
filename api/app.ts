import {MikroORM} from "@mikro-orm/core";
import MikroOrmConfig from "./mikro-orm.config";

export default (async () => {
  
  console.log("hello!");
  
  const orm = await MikroORM.init(MikroOrmConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }
  
})();
