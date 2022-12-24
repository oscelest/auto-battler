import {ScalarTypeDefinitionNode} from "graphql/language";

export class SchemaScalar {
  
  public name: string;
  public value: string;
  public description?: string;
  
  public static collection: {[name: string]: SchemaScalar} = {};
  
  constructor(initializer: EntityScalarInitializer) {
    this.name = initializer.name;
    this.value = initializer.value;
    this.description = initializer.description;
  }
  
  public static instantiate(node: ScalarTypeDefinitionNode, value: string = "any") {
    const name = node.name.value;
    return this.collection[name] ?? (this.collection[name] = new this({name, value, description: node.description?.value}));
  }
  
  public toString() {
    return `type ${this.name} = ${this.value};${this.getDescriptionString()}`;
  }
  
  private getDescriptionString() {
    return this.description ? ` // ${this.description}` : "";
  }
  
}

interface EntityScalarInitializer {
  name: string;
  value: string;
  description?: string;
}
