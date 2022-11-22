import {MikroORM} from "@mikro-orm/core";
import {createYoga} from "graphql-yoga";
import {GraphQLSchema} from "graphql/type";
import Koa from "koa";
import {buildSchema} from "type-graphql";
import {DatabaseConfig} from "./mikro-orm.config";
import {resolver_list} from "./resolvers";

export * from "./entities";

(async () => {
  await MikroORM.init(DatabaseConfig);
  const orm = await MikroORM.init(DatabaseConfig);
  
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
  
  const schema: GraphQLSchema = await buildSchema({
    resolvers: resolver_list,
    dateScalarMode: "isoDate"
  });
  
  const yoga = createYoga<Koa.ParameterizedContext>({schema});
  
  const app = new Koa();
  app.use(async (ctx) => {
    const response = await yoga.handleNodeRequest(ctx.req, ctx);
    
    ctx.status = response.status;
    response.headers.forEach((value, key) => {
      ctx.append(key, value);
    });
    
    ctx.body = response.body;
  });
  
  app.listen(4000, () => {
    console.log("Running a GraphQL API server at http://localhost:4000");
  });
})();
