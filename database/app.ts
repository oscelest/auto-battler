require("dotenv").config({path: "../.env"});
import {MikroORM} from "@mikro-orm/core";
import {fastify, FastifyReply, FastifyRequest} from "fastify";
import {createYoga} from "graphql-yoga";
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
  
  const migrator = orm.getMigrator();
  if (!(await orm.isConnected()) || !(await migrator.getStorage().executed())) {
    await migrator.createInitialMigration();
  }
  else {
    await migrator.createMigration();
  }
  
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
    dateScalarMode: "isoDate"
  });
  
  const app = fastify({logger: true});
  
  const yoga = createYoga<{
    req: FastifyRequest
    reply: FastifyReply
  }>({
    logging: {
      debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
      info: (...args) => args.forEach((arg) => app.log.info(arg)),
      warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
      error: (...args) => args.forEach((arg) => app.log.error(arg))
    },
    schema,
    context: ctx => ({...ctx, entity_manager: orm.em.fork()}) as GraphQLContext
  });
  
  app.route({
    url: "/graphql",
    method: ["GET", "POST", "OPTIONS"],
    handler: async (req, reply) => {
      const response = await yoga.handleNodeRequest(req, {req, reply});
      
      response.headers.forEach((value, key) => reply.header(key, value));
      
      reply.status(response.status);
      reply.send(response.body);
      
      return reply;
    }
  });
  
  await app.listen({port: +(process.env.SERVER_DB_PORT || 8000)});
})();
