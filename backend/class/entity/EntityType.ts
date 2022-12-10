import {SchemaType, SchemaTypeKind} from "../../interfaces/Globals";

export class EntityType {
  
  public name: string;
  public kind: SchemaTypeKind;
  public type?: EntityType;
  
  public static collection: {[name: string]: EntityType} = {};
  
  constructor(initializer: EntityTypeInitializer) {
    this.name = initializer.name;
    this.kind = initializer.kind;
    this.type = initializer.type;
  }
  
  public static async fromSchemaToInstance(definition: SchemaType): Promise<EntityType> {
    if (this.collection[definition.name]) return this.collection[definition.name];
    
    const name = definition.name;
    const kind = definition.kind;
    let type: EntityType | undefined = undefined;
    
    if (definition.kind === SchemaTypeKind.NON_NULL || definition.kind === SchemaTypeKind.LIST) {
      console.log(definition);
      return new EntityType({name, kind, type: await EntityType.fromSchemaToInstance(definition.ofType)});
    }
    else {
      return this.collection[definition.name] ?? (this.collection[definition.name] = new EntityType({name, kind, type}));
    }
  }
  
  
  public toString() {
    switch (this.kind) {
      case SchemaTypeKind.SCALAR:
        return this.toScalarString();
      case SchemaTypeKind.ENUM:
        return this.toEnumString();
      case SchemaTypeKind.INTERFACE:
      case SchemaTypeKind.OBJECT:
        return this.toInterfaceString();
      case SchemaTypeKind.LIST:
        return this.toListString();
      case SchemaTypeKind.NON_NULL:
        return this.toNonNullString();
    }
    throw new Error(`EntityType with type ${this.kind} not yet supported.`);
  }
  
  public toScalarString() {
    switch (this.name) {
      case undefined:
        return "!!UNDEFINED!!";
      case "DateTime":
        return "Date";
      case "Float":
        return "number";
      case "String":
      case "Boolean":
        return this.name.toLowerCase();
    }
    throw new Error(`EntityType Scalar with name ${this.name} not yet supported.`);
  }
  
  public toEnumString() {
    return this.name;
  }
  
  public toListString() {
    return `${this.name}[]`;
  }
  
  public toInterfaceString() {
    return this.name;
  }
  
  public toNonNullString() {
    return "!!NonNullString!!";
  }
  
}

export interface EntityTypeInitializer {
  name: string;
  kind: SchemaTypeKind;
  type?: EntityType;
}
