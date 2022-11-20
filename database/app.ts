import {MikroORM} from "@mikro-orm/core";
import * as dotenv from "dotenv";
dotenv.config();

import MikroOrmConfig from "../mikro-orm.config";

export default (async () => {
  const orm = await MikroORM.init(MikroOrmConfig);
  
  if (!(await orm.isConnected()) || !(await orm.migrator.getStorage().executed())) {
    await orm.getMigrator().createInitialMigration();
  }
  else {
    await orm.getMigrator().createMigration();
  }
  
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }
  
  console.log("API Server started");
})();
