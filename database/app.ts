require("dotenv").config({path: "../.env"});
import {MikroORM} from "@mikro-orm/core";
import {fastify, FastifyReply, FastifyRequest} from "fastify";
import {createYoga, YogaLogger} from "graphql-yoga";
import {buildSchema, ResolverData} from "type-graphql";
import {GraphQLContext} from "./Globals";
import {DatabaseConfig} from "./mikro-orm.config";
import {Database} from "./modules/Database";
import {resolvers} from "./resolvers";

(async () => {
  const logging: YogaLogger = {
    debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
    info: (...args) => args.forEach((arg) => app.log.info(arg)),
    warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
    error: (...args) => args.forEach((arg) => app.log.error(arg))
  };
  
  const orm = await MikroORM.init(DatabaseConfig);
  const entity_manager = orm.em.fork();
  await Database.migrate(orm);
  
  const app = fastify();
  
  const schema = await buildSchema({
    resolvers,
    dateScalarMode: "isoDate",
    authMode: "null",
    authChecker: ({root, args, context, info}: ResolverData<GraphQLContext>, roles) => {
      // console.log(context.req.headers)
      // console.log(roles)
      return false;
    }
  });
  
  const yoga = createYoga<{req: FastifyRequest, reply: FastifyReply}>({
    logging, schema,
    context: ctx => ({...ctx, entity_manager}) as GraphQLContext
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
