require("dotenv").config({path: "../.env"});
import {MikroORM} from "@mikro-orm/core";
import {fastify, FastifyReply, FastifyRequest} from "fastify";
import {createYoga, YogaLogger, YogaServerInstance} from "graphql-yoga";
import {YogaInitialContext} from "graphql-yoga/typings/types";
import {buildSchema} from "type-graphql";
import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {GraphQLContext} from "./Globals";
import {DatabaseConfig} from "./mikro-orm.config";
import {Database} from "./modules/Database";

(async () => {
  let yoga: YogaServerInstance<{req: FastifyRequest, reply: FastifyReply}, {}>;
  let context: undefined | ((initialContext: YogaInitialContext & {req: FastifyRequest, reply: FastifyReply}) => {});
  let resolvers: NonEmptyArray<Function>;
  
  const logging: YogaLogger = {
    debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
    info: (...args) => args.forEach((arg) => app.log.info(arg)),
    warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
    error: (...args) => args.forEach((arg) => app.log.error(arg))
  };
  
  if (process.env.stub?.toLowerCase() !== "true") {
    const orm = await MikroORM.init(DatabaseConfig);
    const entity_manager = orm.em.fork();
    await Database.migrate(orm);
    
    context = ctx => ({...ctx, entity_manager}) as GraphQLContext;
    resolvers = (await import("./resolvers")).resolver_list;
  }
  else {
    resolvers = (await import("./stub/resolvers")).resolver_list;
  }
  
  const app = fastify({logger: true});
  const schema = await buildSchema({
    resolvers,
    dateScalarMode: "isoDate"
  });
  
  yoga = createYoga<{req: FastifyRequest, reply: FastifyReply}>({logging, schema, context});
  
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
