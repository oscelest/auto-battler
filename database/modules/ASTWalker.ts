import {AutoPath} from "@mikro-orm/core/typings";
import {GraphQLResolveInfo, Kind, SelectionSetNode} from "graphql/index";

export module ASTWalker {
  
  export function getFieldsAndPopulate<E extends object>(info: GraphQLResolveInfo): ASTQuery<AutoPath<E, string>> {
    const {fields, populate} = info.fieldNodes.reduce(
      (result, node) => {
        const {fields, populate} = getNodes(node.selectionSet);
        result.fields.push(...fields);
        result.populate.push(...populate);
        return result;
      },
      {fields: [], populate: []} as ASTQuery<AutoPath<E, string>>
    );
    
    return {fields: fields.filter(onlyUnique), populate: populate.filter(onlyUnique)};
  }
  
  function getNodes(set?: SelectionSetNode, path: string[] = []): ASTQuery {
    const result = {fields: [], populate: []} as ASTQuery;
    if (!set) return result;
    
    for (let selection of set.selections) {
      if (selection.kind === Kind.FRAGMENT_SPREAD || selection.kind === Kind.INLINE_FRAGMENT) continue;
      
      const name = selection.name.value;
      const next_set = selection.selectionSet;
      if (next_set) {
        const {fields, populate} = getNodes(next_set, [...path, name]);
        result.populate.push(...populate.map(relation => `${name}.${relation}`));
        result.populate.push(name);
        result.fields.push(...fields);
      }
      else {
        result.fields.push([...path, name].join("."));
      }
    }
    
    return result;
  }
  
  function onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }
  
  
}

interface ASTQuery<S = any> {
  fields: S[];
  populate: S[];
}
