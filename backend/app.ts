import * as fs from "fs";
import SuperAgent from "superagent";
import {Schema} from "./class/entity/Schema";
import {ArithmeticalType, createArithmeticalModifier, ModifierCategoryType} from "./interface";

export const script = (async () => {
  
  const response = await SuperAgent.get("http://localhost:4000/schema").send();
  
  const schema = new Schema({schema: response.text, scalar_map: {DateTime: Date}});
  
  await fs.writeFileSync("./interface.ts", schema.toString());
  
  Query(createArithmeticalModifier)
  ({arithmetical: ArithmeticalType.ADDITIVE, value: 1, category: ModifierCategoryType.CHARGE_SKILL_MAX, value_per_level: 1})
  (["arithmetical", "type"]);
  
})();

type GenericFunction = (...args: any[]) => any

type Unwrap<A> = A extends Array<infer B> ? Unwrap<B> : A

type DeepKey<T, K extends keyof T = keyof T> =
  0 extends 1 & T ? never :
  K extends string
  ? T[K] extends undefined | null | never ? never :
    T[K] extends Array<infer V> ? `${K}.${DeepKey<V>}` :
    T[K] extends Date ? K :
    T[K] extends object ? `${K}.${DeepKey<T[K]>}` :
    K
  : never

type FieldList<T extends GenericFunction> = DeepKey<Unwrap<ReturnType<T>>>[]

export function Query<Fn extends GenericFunction>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    const value = fn(...args);
    return (field_list: FieldList<Fn>) => {
      console.log(value, field_list);
    };
  };
}
