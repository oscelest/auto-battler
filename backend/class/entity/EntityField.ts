import {SchemaField} from "../../interfaces/Globals";
import {EntityType} from "./EntityType";

export class EntityField {
  
  public name: string;
  public description?: string;
  public type: EntityType;
  
  // public argument_list: EntityInputType[]
  
  
  constructor(initializer: EntityFieldInitializer) {
    this.name = initializer.name;
    this.description = initializer.description;
    this.type = initializer.type;
  }
  
  public static async fromSchemaToInstance(definition: SchemaField) {
    const name = definition.name;
    console.log("field", name);
    const type = await EntityType.fromSchemaToInstance(definition.type);
    
    return new this({name, type});
  }
  
  public toString() {
    // return this.nullable ? `${this.name}?: ${this.type}` : `${this.name}: ${this.type}`;
  }
  
}

export interface EntityFieldInitializer {
  name: string;
  description?: string;
  type: EntityType;
}
