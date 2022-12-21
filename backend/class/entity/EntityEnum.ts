import {EnumTypeDefinitionNode} from "graphql/language";

export class EntityEnum {
  
  public name: string;
  public value_list: EntityEnumValue[];
  
  public static collection: {[name: string]: EntityEnum} = {};
  
  constructor(initializer: EntityEnumInitializer) {
    this.name = initializer.name;
    this.value_list = initializer.value_list ?? [];
  }
  
  public static instantiate(node: EnumTypeDefinitionNode) {
    const name = node.name.value;
    if (this.collection[name]) return this.collection[name];
    
    const value_list = [] as EntityEnumValue[];
    for (let enum_value of node.values ?? []) {
      value_list.push({name: enum_value.name.value, description: enum_value.description?.value});
    }
    
    const entity = new this({name, value_list});
    this.collection[name] = entity;
    return entity;
  }
  
  public toString() {
    let result = `export enum ${this.name} {\n`;
    result += this.value_list.map(this.getValueString).join("\n");
    result += "\n}";
    return result;
  }
  
  public getValueString({name, description}: EntityEnumValue) {
    if (description) {
      return `  ${name}, //${description}`;
    }
    return `  ${name},`;
  }
  
}

interface EntityEnumValue {
  name: string;
  description?: string;
}

interface EntityEnumInitializer {
  name: string;
  value_list?: EntityEnumValue[];
}

