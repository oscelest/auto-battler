import {parse} from "graphql";
import {DefinitionNode, DocumentNode, Kind, TypeNode} from "graphql/language";
import {SchemaKeywordType} from "../../enums/SchemaKeywordType";
import {EntityEnum} from "./EntityEnum";
import {SchemaDictionary} from "./SchemaDictionary";
import {SchemaInterface} from "./SchemaInterface";
import {SchemaMethod} from "./SchemaMethod";
import {SchemaScalar} from "./SchemaScalar";

export class Schema {
  
  public schema: string;
  public scalar_map: ScalarMap;
  public node: DocumentNode;
  public enum_list: EntityEnum[];
  public scalar_list: SchemaScalar[];
  public method_list: SchemaMethod[];
  public interface_list: SchemaInterface[];
  public dictionary_list: SchemaDictionary[];
  
  constructor(initializer: EntitySchemaInitializer) {
    this.schema = initializer.schema;
    this.scalar_map = initializer.scalar_map ?? {};
    
    this.node = parse(this.schema);
    
    this.enum_list = [];
    this.scalar_list = [];
    this.method_list = [];
    this.interface_list = [];
    this.dictionary_list = [];
    
    for (let definition of this.node.definitions) {
      this.addDefinition(definition);
    }
  }
  
  private addDefinition(node: DefinitionNode) {
    switch (node.kind) {
      case Kind.INTERFACE_TYPE_DEFINITION:
        return this.interface_list.push(SchemaInterface.instantiate(node));
      case Kind.ENUM_TYPE_DEFINITION:
        return this.enum_list.push(EntityEnum.instantiate(node));
      case Kind.SCALAR_TYPE_DEFINITION:
        return this.scalar_list.push(SchemaScalar.instantiate(node, this.getScalarValue(node.name.value)));
      case Kind.OBJECT_TYPE_DEFINITION:
        if (node.name.value === SchemaKeywordType.QUERY || node.name.value === SchemaKeywordType.MUTATION) {
          return this.method_list.push(...node.fields?.map(field => SchemaMethod.instantiate(field)) ?? []);
        }
        else {
          return this.interface_list.push(SchemaInterface.instantiate(node));
        }
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        return this.dictionary_list.push(SchemaDictionary.instantiate(node));
    }
    
    return null;
  }
  
  private getScalarValue(name: string) {
    const value = this.scalar_map[name];
    if (typeof value === "string") return value;
    if (typeof value === "function") return value.name;
    if (typeof value === "object") return value.toString();
    return value;
  }
  
  public toString() {
    let value = [];
    
    value.push("type Float = number;");
    value.push("type String = string;");
    value.push("type Boolean = boolean;");
    value.push(this.scalar_list.join("\n"));
    value.push("");
    value.push(this.method_list.join("\n\n"));
    value.push(this.interface_list.join("\n\n"));
    value.push(this.dictionary_list.join("\n\n"));
    value.push(this.enum_list.join("\n\n"));
    
    return value.join("\n");
  }
  
  public toJSON() {
    return {
      enum_list: this.enum_list,
      interface_list: this.interface_list
    };
  }
  
  public static parseType(type: TypeNode): EntityFieldType {
    switch (type.kind) {
      case Kind.NON_NULL_TYPE: {
        const {value} = this.parseType(type.type);
        return {value, nullable: false};
      }
      case Kind.NAMED_TYPE:
        return {value: type.name.value, nullable: true};
      case Kind.LIST_TYPE:
        let {value, nullable} = this.parseType(type.type);
        return {value: nullable ? `(${value} | null)[]` : `${value}[]`, nullable: true};
    }
    throw new Error();
  }
  
}

export interface ScalarMap {
  [name: string]: string | {name: string} | {toString(): string};
}

interface EntitySchemaInitializer {
  schema: string;
  scalar_map?: ScalarMap;
}

interface EntityFieldType {
  value: string;
  nullable: boolean;
}
