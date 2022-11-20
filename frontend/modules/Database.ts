import {MikroORM, RequestContext} from "@mikro-orm/core";
import {GraphQLSchema} from "graphql";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {config} from "../mikro-orm.config";

module Database {
  
  let database: MikroORM;
  let schema: GraphQLSchema;
  
  export async function getEntityManager() {
    const connection = await generateConnection();
    // return connection.em.fork();
  }
  
  async function generateConnection() {
    if (database) return database;
    return database = await MikroORM.init(await config());
  }
  
  export function withORM(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const orm = await generateConnection();
      return RequestContext.createAsync(orm.em, async () => handler(req, res));
    };
  }
}

export default Database;
