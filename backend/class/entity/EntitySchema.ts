import {Schema, SchemaType, SchemaTypeKind} from "../../interfaces/Globals";
import {EntityEnum} from "./EntityEnum";
import {EntityInterface} from "./EntityInterface";
import {EntityObject} from "./EntityObject";

export class EntitySchema {
  
  public interface_list: EntityInterface[];
  public enum_list: EntityEnum[];
  public object_list: EntityObject[];
  
  private static reserved_object_keyword_list = ["Query", "Mutation", "__Schema", "__Type", "__Field", "__InputValue", "__EnumValue", "__Directive"];
  private static reserved_enum_keyword_list = ["__TypeKind", "__DirectiveLocation"];
  
  constructor() {
    this.interface_list = [];
    this.enum_list = [];
    this.object_list = [];
  }
  
  public async populate(definition: Schema) {
    for (let type of definition.types) {
      await this.addType(type);
    }
  }
  
  private async addType(definition: SchemaType) {
    switch (definition.kind) {
      case SchemaTypeKind.INTERFACE:
        return this.interface_list.push(await EntityInterface.fromSchemaToInstance(definition));
      case SchemaTypeKind.ENUM:
      // this.enum_list.push(EntityEnum.fromSchemaToInstance(type));
      // break;
      case SchemaTypeKind.LIST:
      case SchemaTypeKind.OBJECT:
      // this.object_list.push(EntityObject.fromSchemaToInstance(type));
      // break;
      case SchemaTypeKind.NON_NULL:
      case SchemaTypeKind.UNION:
      case SchemaTypeKind.SCALAR:
      case SchemaTypeKind.INPUT_OBJECT:
        return;
    }
  }
  
  public toString() {
    const value = [] as string[];
    for (let entity of this.interface_list) {
      value.push(entity.toString());
    }
    for (let entity of this.object_list.filter(v => !EntitySchema.reserved_object_keyword_list.includes(v.name))) {
      value.push(entity.toString());
    }
    for (let entity of this.enum_list.filter(v => !EntitySchema.reserved_enum_keyword_list.includes(v.name))) {
      value.push(entity.toString());
    }
    return value.join("\n\n");
  }
  
}
