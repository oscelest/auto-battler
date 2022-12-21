import {FieldDefinitionNode, InputValueDefinitionNode, Kind} from "graphql/language";
import {EntityValue} from "./EntityValue";

export class EntityField {
  
  public name: string;
  
  public value: EntityValue;
  
  public argument_list: EntityFieldArgument[];
  
  constructor(initializer: EntityFieldInitializer) {
    
    this.name = initializer.name;
    this.value = initializer.value;
    this.argument_list = initializer.argument_list ?? [];
  }
  
  public static instantiate(node: FieldDefinitionNode | InputValueDefinitionNode) {
    const name = node.name.value;
    
    const argument_list = [] as EntityFieldArgument[];
    if (node.kind === Kind.FIELD_DEFINITION) {
      for (let argument of node.arguments ?? []) {
        argument_list.push({name: argument.name.value, value: EntityValue.instantiate(argument.type)});
      }
    }
    
    return new this({name, value: EntityValue.instantiate(node.type), argument_list});
  }
  
  public toString(): string {
    if (this.argument_list.length) {
      const argument_string = this.argument_list.map(argument => `${argument.name}: ${argument.value}`);
      return `${this.name}(${argument_string.join(", ")}): ${this.value.toString()}`;
    }
    else if (this.value.nullable) {
      return `${this.name}?: ${this.value.toString(true)}`;
    }
    return `${this.name}: ${this.value.toString()}`;
  }
  
}

interface EntityFieldInitializer {
  name: string;
  value: EntityValue;
  argument_list?: EntityFieldArgument[];
}

interface EntityFieldArgument {
  name: string;
  value: EntityValue;
}
