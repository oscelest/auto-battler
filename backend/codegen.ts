require("dotenv").config({path: "../.env"});
import type {CodegenConfig} from "@graphql-codegen/cli";

const port = +(process.env.SERVER_BACKEND_PORT || 8000);
const config: CodegenConfig = {
  overwrite: true,
  schema: `http://localhost:${port}/graphql`,
  documents: [
    "./gql/operations/*.ts"
  ],
  generates: {
    "./gql/sdk.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request"
      ]
    }
  }
};

export default config;
