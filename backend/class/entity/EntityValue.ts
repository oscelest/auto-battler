import {Kind, TypeNode} from "graphql/language";

export class EntityValue {
  
  public value: string | EntityValue;
  public list: boolean;
  public nullable: boolean;
  
  constructor(initializer: EntityValueInitializer) {
    this.value = initializer.value ?? "";
    
    this.list = initializer.list ?? false;
    this.nullable = initializer.nullable ?? true;
  }
  
  public static instantiate(node: TypeNode) {
    return this.resolveNode(node, new EntityValue({}));
  }
  
  private static resolveNode(node: TypeNode, current: EntityValue): EntityValue {
    switch (node.kind) {
      case Kind.NON_NULL_TYPE:
        current.nullable = false;
        return this.resolveNode(node.type, current);
      case Kind.LIST_TYPE:
        current.list = true;
        return this.resolveNode(node.type, current);
      case Kind.NAMED_TYPE:
        current.value = this.parseValue(node.name.value);
        return current;
    }
    throw new Error();
  }
  
  private static parseValue(value: string) {
    switch (value) {
      case "Float":
        return "number";
      case "String":
        return "string";
      case "Boolean":
        return "boolean";
      default:
        return value;
    }
  }
  
  public toString(null_handled: boolean = false, list_handled: boolean = false): string {
    const nullable = !null_handled && this.nullable;
    const listable = !list_handled && this.list;
    
    let value = nullable ? `${this.value.toString()} | null` : this.value.toString();
    if (listable) {
      if (nullable) {
        value = `(${value})[]`;
      }
      else {
        value = `${value}[]`;
      }
    }
    return value;
  }
}

interface EntityValueInitializer {
  nullable?: boolean;
  list?: boolean;
  value?: string;
}
