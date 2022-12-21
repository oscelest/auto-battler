// import {EntityEnum} from "./class/entity/EntityEnum";
import * as fs from "fs";
import SuperAgent from "superagent";
import {EntitySchema} from "./class/entity/EntitySchema";
import {Query} from "./interface";

export const script = (async () => {
  
  const response = await SuperAgent.get("http://localhost:4000/schema").send();
  
  const schema = new EntitySchema({schema: response.text});
  
  // console.log(schema.toString());
  
  
  // EntityEnum.registerSchema(data);
  
  // let enum_regex = /^enum\s*[^{]*{[^}]*}$/mig;
  // let enum_result: EnumDefinition | null;
  //
  // while (enum_result = enum_regex.exec(data)) {
  //   if (!enum_result[0]) continue;
  //   console.log(enum_result[0]);
  // }
  
  
  // const schema = new EntitySchema();
  // await schema.populate(data.__schema);
  //
  // console.log(schema.interface_list);
  //
  // for (let definition of schema.interface_list) {
  //   console.log(definition.name);
  //   console.log(definition.field_list);
  // }
  
  // fs.writeFileSync("./data.json", JSON.stringify(entity.node, null, 2));
  await fs.writeFileSync("./interface.ts", schema.toString());
  
  query("getArithmeticalModifierList", ["value"]);
  
})();

function query<K extends keyof Query, R extends ReturnType<Query[K]>>(method: K, fields: DeepKey<Unwrap<R>>[]): R {
//   // const object = fields.reduce(
//   //   (result, value) => {
//   //     const [...path, field] = value.split(".");
//   //
//   //     let current_object = result;
//   //     for (let part of path) {
//   //       if (!current_object[part]) {
//   //         current_object[part] = {__keys__: [] as string[]} as GraphQLDeepField;
//   //       }
//   //       current_object = current_object[part];
//   //     }
//   //     return result;
//   //   },
//   //   {__keys__: [] as string[]} as GraphQLDeepField
//   // );
//
//   // console.log(object);
//
  return [] as R;
}
//
type Unwrap<A> = A extends Array<infer B> ? B : A

type DeepKey<T, K extends keyof T = keyof T> =
  0 extends 1 & T ? never :
  K extends string
  ? T[K] extends undefined | null | never ? never :
    T[K] extends Array<infer V> ? `${K}.${DeepKey<V>}` :
    T[K] extends Date ? K :
    T[K] extends object ? `${K}.${DeepKey<T[K]>}` :
    K
  : never
