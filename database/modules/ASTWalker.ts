import {GraphQLResolveInfo, Kind, SelectionSetNode} from "graphql/index";

export module ASTWalker {
  
  export function getRelationList(info: GraphQLResolveInfo) {
    return info.fieldNodes.reduce((result, node) => [...result, getSelection(node.selectionSet).join(".")], [] as string[]);
  }
  
  function getSelection(set?: SelectionSetNode, path: string[] = []): string[][] {
    const result = [] as string[][];
    if (!set) return result;
    
    for (let selection of set.selections) {
      switch (selection.kind) {
        case Kind.FIELD:
          if (selection.selectionSet) {
            const name = [...path, selection.name.value];
            result.push(name);
            result.push(...getSelection(selection.selectionSet, [...path, selection.name.value]));
          }
          break;
        case Kind.FRAGMENT_SPREAD:
        case Kind.INLINE_FRAGMENT:
          break;
      }
    }
    
    return result;
  }
  
}
