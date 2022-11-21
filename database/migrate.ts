import {MikroORM} from "@mikro-orm/core";
import {DatabaseConfig} from "./mikro-orm.config";

export * from "./entities";

export default (async () => {
  const orm = await MikroORM.init(DatabaseConfig);
  
  console.log("Creating migration...");
  if (!(await orm.isConnected()) || !(await orm.migrator.getStorage().executed())) {
    await orm.getMigrator().createInitialMigration();
  }
  else {
    await orm.getMigrator().createMigration();
  }
  console.log("Created migration.");
  
  const migrator = orm.getMigrator();
  
  console.log("Loading pending migrations...");
  const migrations = await migrator.getPendingMigrations();
  console.log("Loaded pending migrations.");
  
  if (migrations && migrations.length > 0) {
    console.log("Updating database with migrations...");
    await migrator.up();
    console.log("Updating database with migrations.");
    console.log("Migration completed");
  }
  else {
    console.log("No changes made to the database...");
  }
  
  process.exit();
})();
