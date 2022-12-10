import * as fs from "fs";
import SuperAgent from "superagent";
import {EntitySchema} from "./class/entity/EntitySchema";
import {SchemaResponse} from "./interfaces/Globals";

(async () => {
  const query = fs.readFileSync("./query/__schema.gql").toString();
  const response = await SuperAgent.post("http://localhost:4000/graphql").send({query});
  const data = response.body.data as SchemaResponse;
  
  const schema = new EntitySchema();
  await schema.populate(data.__schema);
  
  console.log(schema.interface_list);
  
  for (let definition of schema.interface_list) {
    console.log(definition.name);
    console.log(definition.field_list);
  }
  
  // fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  // await fs.writeFileSync("./interface.ts", new EntitySchema(data.__schema).toString());
})();

