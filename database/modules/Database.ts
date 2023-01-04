import {MikroORM} from "@mikro-orm/core";

export module Database {
  
  export async function migrate(orm: MikroORM) {
    const migrator = orm.getMigrator();
    if (!(await orm.isConnected()) || !(await orm.migrator.getStorage().executed())) {
      console.log("Creating initial migration...");
      await orm.getMigrator().createInitialMigration();
    }
    else {
      console.log("Creating migration...");
      await orm.getMigrator().createMigration();
    }
    console.log("Created migration.");
    
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
  }
}
