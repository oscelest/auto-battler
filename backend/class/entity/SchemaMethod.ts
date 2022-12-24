import {FieldDefinitionNode} from "graphql/language";
import {Schema} from "./Schema";
import {SchemaArgument} from "./SchemaArgument";

export class SchemaMethod {
  
  public name: string;
  public value: string;
  public nullable: boolean;
  public argument_list: SchemaArgument[];
  
  constructor(initializer: SchemaMethodInitializer) {
    this.name = initializer.name;
    this.value = initializer.value;
    this.nullable = initializer.nullable ?? true;
    this.argument_list = initializer.argument_list ?? [];
  }
  
  public static instantiate(node: FieldDefinitionNode) {
    const name = node.name.value;
    const {value, nullable} = Schema.parseType(node.type);
    const argument_list = node.arguments?.map(value => SchemaArgument.instantiate(value));
    
    return new this({name, value, nullable, argument_list});
  }
  
  public toString() {
    return `export function ${this.name}(${this.getArgumentListString()}): ${this.getValueString()} {\n${this.getIndentString()}return {${this.getArgumentNameListString()}} as any;\n}`;
  }
  
  public getIndentString() {
    return " ".repeat(2);
  }
  
  public getArgumentNameListString() {
    return this.argument_list.map(argument => argument.name).join(", ");
  }
  
  public getArgumentListString() {
    return this.argument_list.map(argument => argument.toString()).join(", ");
  }
  
  public getValueString() {
    return this.nullable ? `${this.value} | null` : this.value;
  }
  
}

interface SchemaMethodInitializer {
  name: string;
  value: string;
  nullable?: boolean;
  argument_list?: SchemaArgument[];
}
