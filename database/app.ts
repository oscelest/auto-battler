import {MikroORM} from "@mikro-orm/core";
import * as fs from "fs";
import {createYoga} from "graphql-yoga";
import Koa from "koa";
import {buildSchema} from "type-graphql";
import {GraphQLContext} from "./Globals";
import {DatabaseConfig} from "./mikro-orm.config";
import {
  ArithmeticalModifierResolver,
  AttributeModifierResolver,
  ComboPointActionResolver,
  DamageActionResolver,
  DamageReceivedTriggerResolver,
  EffectActionResolver,
  EffectResolver,
  ExpirationTriggerResolver,
  HealActionResolver,
  HealingReceivedTriggerResolver,
  OperationResolver,
  PeriodicTriggerResolver,
  SkillResolver,
  UnitResolver,
  UnitTypeResolver
} from "./resolvers";

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
  
  const schema = await buildSchema({
    resolvers: [
      ComboPointActionResolver, DamageActionResolver, EffectActionResolver, HealActionResolver,
      EffectResolver,
      ArithmeticalModifierResolver, AttributeModifierResolver,
      OperationResolver,
      SkillResolver,
      PeriodicTriggerResolver, DamageReceivedTriggerResolver, HealingReceivedTriggerResolver, ExpirationTriggerResolver,
      UnitResolver, UnitTypeResolver
    ],
    dateScalarMode: "isoDate",
    emitSchemaFile: "./schema.sdl"
  
  });
  
  
  const yoga = createYoga<Koa.ParameterizedContext>({
    schema,
    context: ctx => ({...ctx, entity_manager: orm.em.fork()}) as GraphQLContext
  });
  
  const app = new Koa();
  
  app.use(async (ctx) => {
    if (ctx.req.url === "/schema") {
      ctx.status = 200;
      ctx.body = fs.createReadStream("./schema.sdl");
      ctx.response.attachment("./schema.sdl", {fallback: false, type: "inline"});
    }
    else {
      const {headers, status, body} = await yoga.handleNodeRequest(ctx.req, ctx);
    
      ctx.body = body;
      ctx.status = status;
      headers.forEach((value, key) => ctx.append(key, value));
    }
  });
  
  
  app.listen(4000, () => {
    console.log("Running a GraphQL API server at http://localhost:4000");
  });
})();
