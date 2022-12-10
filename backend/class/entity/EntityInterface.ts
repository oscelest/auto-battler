import * as fs from "fs";
import SuperAgent from "superagent";
import {SchemaType, SchemaTypeKind, TypeResponse} from "../../interfaces/Globals";
import {EntityField} from "./EntityField";

export class EntityInterface {
  
  public name: string;
  public field_list: EntityField[];
  public interface_list: EntityInterface[];
  
  public static collection: {[name: string]: EntityInterface} = {};
  
  constructor(initializer: EntityInterfaceInitializer) {
    this.name = initializer.name;
    this.field_list = initializer.field_list;
    this.interface_list = initializer.interface_list;
  }
  
  public static async fromSchemaToInstance(definition: SchemaType) {
    if (this.collection[definition.name]) return this.collection[definition.name];
    if (definition.kind !== SchemaTypeKind.INTERFACE) {
      throw new Error(`Trying to instantiate an EntityInterface using SchemaType definition with kind ${definition.kind}`);
    }
    
    const query = fs.readFileSync("./query/__type.gql").toString().replace("$name", definition.name);
    const response = await SuperAgent.post("http://localhost:4000/graphql").send({query});
    const data = response.body.data as TypeResponse;
    
    const name = data.__type.name;
    const interface_list = [] as EntityInterface[];
    for (let definition of data.__type.interfaces ?? []) {
      interface_list.push(await this.fromSchemaToInstance(definition));
    }
    
    const field_list = [] as EntityField[];
    for (let definition of data.__type.fields ?? []) {
      field_list.push(await EntityField.fromSchemaToInstance(definition));
    }
    
    return this.collection[definition.name] ?? (this.collection[definition.name] = new EntityInterface({name, field_list, interface_list}));
  }
  
  public toString() {
    let value = `export interface ${this.name} {\n`;
    for (let field of this.field_list) {
      value += `  ${field}\n`;
    }
    value += "}";
    return value;
  }
  
}

export interface EntityInterfaceInitializer {
  name: string;
  field_list: EntityField[];
  interface_list: EntityInterface[];
}
