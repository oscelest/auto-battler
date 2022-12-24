import {InputValueDefinitionNode} from "graphql/language";
import {Schema} from "./Schema";

export class SchemaArgument {
  
  public name: string;
  public value: string;
  public nullable: boolean;
  
  constructor(initializer: SchemaArgumentInitializer) {
    this.name = initializer.name;
    this.value = initializer.value;
    this.nullable = initializer.nullable ?? false;
  }
  
  public static instantiate(node: InputValueDefinitionNode) {
    const name = node.name.value;
    const {value, nullable} = Schema.parseType(node.type);
    
    return new this({name, value, nullable});
  }
  
  public toString(): string {
    return `${this.getNameString()}: ${this.value}`;
  }
  
  private getNameString() {
    return this.nullable ? `${this.name}?` : this.name;
  }
  
}

interface SchemaArgumentInitializer {
  name: string;
  value: string;
  nullable?: boolean;
}
