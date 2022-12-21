import {InputObjectTypeDefinitionNode, InterfaceTypeDefinitionNode, Kind, ObjectTypeDefinitionNode} from "graphql/language";
import {EntityField} from "./EntityField";

export class EntityInterface {
  
  public name: string;
  public field_list: EntityField[];
  public interface_list: string[];
  
  public static collection: {[name: string]: EntityInterface} = {};
  
  constructor(initializer: EntityInterfaceInitializer) {
    
    this.name = initializer.name;
    this.field_list = initializer.field_list ?? [];
    this.interface_list = initializer.interface_list ?? [];
  }
  
  public static instantiate(node: InterfaceTypeDefinitionNode | ObjectTypeDefinitionNode | InputObjectTypeDefinitionNode): EntityInterface {
    const name = node.name.value;
    if (this.collection[name]) return this.collection[name];
    
    const field_list: EntityField[] = [];
    for (let definition of node.fields ?? []) {
      field_list.push(EntityField.instantiate(definition));
    }
    
    const interface_list: string[] = [];
    if (node.kind !== Kind.INPUT_OBJECT_TYPE_DEFINITION) {
      for (let definition of node.interfaces ?? []) {
        interface_list.push(definition.name.value);
      }
    }
    
    return this.collection[name] = new this({name, field_list, interface_list});
  }
  
  public toString() {
    const field_list = [...this.field_list];
  
    for (let name of this.interface_list) {
      const definition = EntityInterface.collection[name];
      for (let i = field_list.length - 1; i > 0; i--) {
        const field = field_list[i];
        if (definition.field_list.some(value => value.name === field.name)) {
          console.log("removing", field.name);
          field_list.splice(i, 1);
        }
      }
    }
  
    if (!this.interface_list.length) {
      return `export interface ${this.name} {\n  ${field_list.join("\n  ")}\n}`;
    }
  
    return `export interface ${this.name} extends ${this.interface_list.join(", ")} {\n  ${field_list.join("\n  ")}\n}`;
  }
  
}

interface EntityInterfaceInitializer {
  name: string;
  field_list: EntityField[];
  interface_list: string[];
}
