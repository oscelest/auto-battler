import type {NextApiHandler} from "next";
import "reflect-metadata";
import Database from "../../modules/Database";

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false
  }
};

const handler: NextApiHandler = async (req, res) => {
  // const em = getEM();
  // const users = await em.find(UnitEntity, {});
  
  // console.log(`context-specific em-ID: ${em.id}`);
  
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({}));
};

export default Database.withORM(handler);

// export default createYoga<{req: NextApiRequest, res: NextApiResponse}>({
//   // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
//   graphqlEndpoint: "/api",
//   context: async (initialContext) => {
//     return {
//       ...initialContext,
//       // em: await Database.database
//     };
//   },
//   schema: buildSchema({
//     resolvers: [UnitResolver],
//     dateScalarMode: "isoDate"
//   })
// });
