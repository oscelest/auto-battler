import {InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode} from "graphql/language";
import {SchemaProperty} from "./SchemaProperty";

export class SchemaInterface {
  
  public name: string;
  public description?: string;
  public field_list: SchemaProperty[];
  public interface_list: string[];
  
  public static collection: {[name: string]: SchemaInterface} = {};
  
  constructor(initializer: EntityInterfaceInitializer) {
    
    this.name = initializer.name;
    this.description = initializer.description;
    this.field_list = initializer.field_list ?? [];
    this.interface_list = initializer.interface_list ?? [];
  }
  
  public static instantiate(node: InterfaceTypeDefinitionNode | ObjectTypeDefinitionNode): SchemaInterface {
    const name = node.name.value;
    if (this.collection[name]) return this.collection[name];
    
    const description = node.description?.value;
    const field_list = node.fields?.map(node => SchemaProperty.instantiate(node));
    const interface_list = node.interfaces?.map(node => node.name.value);
    
    return this.collection[name] = new this({name, description, field_list, interface_list});
  }
  
  public toString(indent: number = 2) {
    const interface_list = this.interface_list.filter(name => !this.interface_list.some(sub_name => SchemaInterface.collection[sub_name].interface_list.includes(name)));
    const field_list = this.field_list.filter(field => !interface_list.some(name => SchemaInterface.collection[name].field_list.some(sub_field => sub_field.name === field.name)));
    
    return `${this.getDescriptionString()}export interface ${this.getNameString(interface_list)} {\n${this.getFieldListString(field_list, indent)}\n}`;
  }
  
  private getNameString(interface_list: string[] = []) {
    return interface_list.length ? `${this.name} extends ${interface_list.join(", ")}` : this.name;
  }
  
  private getDescriptionString() {
    return this.description ? `// ${this.description}\n` : "";
  }
  
  private getFieldListString(field_list: SchemaProperty[], indent: number) {
    return field_list.map(field => field.toString(indent)).join("\n");
  }
  
}


interface EntityInterfaceInitializer {
  name: string;
  description?: string;
  field_list?: SchemaProperty[];
  interface_list?: string[];
}
