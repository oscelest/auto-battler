import {parse} from "graphql";
import {DefinitionNode, DocumentNode, Kind} from "graphql/language";
import {EntityEnum} from "./EntityEnum";
import {EntityInterface} from "./EntityInterface";
import {EntityScalar} from "./EntityScalar";

export class EntitySchema {
  
  public schema: string;
  public node: DocumentNode;
  public enum_list: EntityEnum[];
  public scalar_list: EntityScalar[];
  public interface_list: EntityInterface[];
  
  constructor(initializer: EntitySchemaInitializer) {
    this.schema = initializer.schema;
    this.node = parse(this.schema);
    
    this.enum_list = [];
    this.scalar_list = [];
    this.interface_list = [];
    
    for (let definition of this.node.definitions) {
      this.addDefinition(definition);
    }
    
    // this.addDefinition(this.node.definitions[0]);
  }
  
  private addDefinition(node: DefinitionNode) {
    switch (node.kind) {
      case Kind.INTERFACE_TYPE_DEFINITION:
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        return this.interface_list.push(EntityInterface.instantiate(node));
      case Kind.ENUM_TYPE_DEFINITION:
        return this.enum_list.push(EntityEnum.instantiate(node));
      case Kind.SCALAR_TYPE_DEFINITION:
        return this.scalar_list.push(EntityScalar.instantiate(node));
    }
    
    return null;
  }
  
  public toString() {
    let value = [];
    value.push(this.scalar_list.join("\n"));
    value.push("");
    value.push(this.interface_list.join("\n\n"));
    value.push(this.enum_list.join("\n\n"));
    
    return value.join("\n");
  }
  
  public toJSON() {
    return {
      enum_list: this.enum_list,
      interface_list: this.interface_list
    };
  }
  
}

interface EntitySchemaInitializer {
  schema: string;
}
