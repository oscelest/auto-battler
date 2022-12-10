import {SchemaType, SchemaTypeKind} from "../../interfaces/Globals";

export class EntityEnum {
  
  public name: string;
  public value_list: [string, string?][];
  
  public static collection: {[name: string]: EntityEnum} = {};
  
  constructor(type: SchemaType) {
    this.name = type.name;
    this.value_list = type.enumValues.map(definition => [definition.name, definition.description]);
  }
  
  public static fromSchemaToInstance(definition: SchemaType) {
    if (definition.kind !== SchemaTypeKind.ENUM) {
      throw new Error(`Trying to instantiate an EntityEnum using SchemaType definition with kind ${definition.kind}`);
    }
    
    return this.collection[definition.name] ?? (this.collection[definition.name] = new EntityEnum(definition));
  }
  
  public toString() {
    let result = `export enum ${this.name} {\n`;
    result += this.value_list.map(this.getValueString).join("\n");
    result += "\n}";
    return result;
  }
  
  public getValueString([name, description]: [string, string?]) {
    if (description) {
      return `  ${name}, //${description}`;
    }
    return `${name},`;
  }
  
}

