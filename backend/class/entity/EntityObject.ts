import {SchemaType, SchemaTypeKind} from "../../interfaces/Globals";
import {EntityField} from "./EntityField";
import {EntityInterface} from "./EntityInterface";

export class EntityObject {
  
  public name: string;
  public field_list: EntityField[];
  public interface_list: EntityInterface[];
  
  public static collection: {[name: string]: EntityObject} = {};
  
  constructor(type: SchemaType) {
    this.name = type.name;
    
    this.field_list = type.fields.map(definition => EntityField.fromSchemaToInstance(definition));
    
    this.interface_list = type.interfaces.map(definition => EntityInterface.fromSchemaToInstance(definition));
  }
  
  public static fromSchemaToInstance(definition: SchemaType) {
    if (definition.kind !== SchemaTypeKind.OBJECT) {
      throw new Error(`Trying to instantiate an EntityObject using SchemaType definition with kind ${definition.kind}`);
    }
    
    return this.collection[definition.name] ?? (this.collection[definition.name] = new EntityObject(definition));
  }
  
  public toString() {
    let value = this.getHeaderString();
    for (let field of this.field_list) {
      value += `  ${field}\n`;
    }
    value += "}";
    return value;
  }
  
  public getHeaderString() {
    if (this.interface_list.length) {
      return `export interface ${this.name} extends ${this.interface_list.join(", ")} {\n`;
    }
    return `export interface ${this.name} {\n`;
  }
  
}
