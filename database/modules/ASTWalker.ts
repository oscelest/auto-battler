import {Collection} from "@mikro-orm/core";
import {GraphQLResolveInfo, Kind, SelectionSetNode} from "graphql/index";
import {CoreEntity} from "../entities";

export module ASTWalker {
  
  export function getEntityFieldsAndPopulate<E extends object>(info: GraphQLResolveInfo): ASTQuery<DeepKey<E>, DeepKey<E>> {
    const {fields, populate} = info.fieldNodes.reduce(
      (result, node) => {
        const {fields, populate} = getNodes(node.selectionSet);
        result.fields.push(...fields);
        result.populate.push(...populate);
        return result;
      },
      {fields: [], populate: []} as ASTQuery<DeepKey<E>, DeepKey<E>>
    );
    
    return {fields: fields.filter(onlyUnique), populate: populate.filter(onlyUnique)};
  }
  
  function getNodes<E extends object>(set?: SelectionSetNode, path: string[] = []): ASTQuery<DeepKey<E>, DeepKey<E>> {
    const result = {fields: [], populate: []} as ASTQuery<DeepKey<E>, DeepKey<E>>;
    if (!set) return result;
    
    for (let selection of set.selections) {
      if (selection.kind === Kind.FRAGMENT_SPREAD || selection.kind === Kind.INLINE_FRAGMENT) continue;
      
      const name = selection.name.value;
      const next_set = selection.selectionSet;
      if (next_set) {
        const {fields, populate} = getNodes(next_set, [...path, name]);
        result.populate.push(...populate.map(relation => `${name}.${relation}`) as DeepKey<E>[]);
        result.populate.push(name as DeepKey<E>);
        result.fields.push(...fields);
      }
      else {
        result.fields.push([...path, name].join(".") as DeepKey<E>);
      }
    }
    
    return result;
  }
  
  function onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }
  
}

interface ASTQuery<F = any, P = any> {
  fields: F[];
  populate: P[];
}

type DeepKey<T extends object, K extends keyof T = keyof T> =
  K extends string
  ? T[K] extends Function ? never :
    T[K] extends object
    ? T[K] extends Array<infer R> | Collection<infer R>
      ? R extends CoreEntity ? `${K & string}.${DeepKey<R> & string}` : K
      : T[K] extends CoreEntity ? `${K & string}.${DeepKey<T[K]> & string}` : K
    : K
  : never

