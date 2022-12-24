import {InputObjectTypeDefinitionNode} from "graphql/language";
import {SchemaProperty} from "./SchemaProperty";

export class SchemaDictionary {
  
  public name: string;
  public description?: string;
  public field_list: SchemaProperty[];
  
  public static collection: {[name: string]: SchemaDictionary} = {};
  
  constructor(initializer: SchemaDictionaryInitializer) {
    this.name = initializer.name;
    this.description = initializer.description;
    this.field_list = initializer.field_list ?? [];
  }
  
  public static instantiate(node: InputObjectTypeDefinitionNode): SchemaDictionary {
    const name = node.name.value;
    if (this.collection[name]) return this.collection[name];
    
    const description = node.description?.value;
    const field_list = node.fields?.map(node => SchemaProperty.instantiate(node));
    
    return this.collection[name] = new this({name, description, field_list});
  }
  
  public toString(indent: number = 2) {
    return `${this.getDescriptionString()}export interface ${this.getNameString()} {\n${this.getFieldListString(indent)}\n}`;
  }
  
  private getNameString(interface_list: string[] = []) {
    return interface_list.length ? `${this.name} extends ${interface_list.join(", ")}` : this.name;
  }
  
  private getDescriptionString() {
    return this.description ? `// ${this.description}\n` : "";
  }
  
  private getFieldListString(indent: number) {
    return this.field_list.map(field => field.toString(indent)).join("\n");
  }
  
}


interface SchemaDictionaryInitializer {
  name: string;
  description?: string;
  field_list?: SchemaProperty[];
}
