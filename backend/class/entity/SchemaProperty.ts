import {FieldDefinitionNode} from "graphql/language";
import {InputValueDefinitionNode} from "graphql/language/ast";
import {Schema} from "./Schema";

export class SchemaProperty {
  
  public name: string;
  public value: string;
  public nullable: boolean;
  public description?: string;
  
  constructor(initializer: EntityFieldInitializer) {
    this.name = initializer.name;
    this.value = initializer.value;
    this.nullable = initializer.nullable ?? false;
    this.description = initializer.description;
  }
  
  public static instantiate(node: FieldDefinitionNode | InputValueDefinitionNode) {
    const name = node.name.value;
    const description = node.description?.value;
    
    return new this({...Schema.parseType(node.type), name, description});
  }
  
  public toString(indent: number = 2): string {
    return `${this.getIndentString(indent)}${this.getNameString()}: ${this.value};${this.getDescriptionString()}`;
  }
  
  private getIndentString(indent: number) {
    return " ".repeat(indent);
  }
  
  private getNameString() {
    return this.nullable ? `${this.name}?` : this.name;
  }
  
  private getDescriptionString() {
    return this.description ? ` // ${this.description}` : "";
  }
  
}

interface EntityFieldInitializer {
  name: string;
  value: string;
  nullable?: boolean;
  description?: string;
}
