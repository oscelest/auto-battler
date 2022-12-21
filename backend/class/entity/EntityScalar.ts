import {ScalarTypeDefinitionNode} from "graphql/language";

export class EntityScalar {
  
  public name: string;
  public description?: string;
  
  public static collection: {[name: string]: EntityScalar} = {};
  
  constructor(initializer: EntityScalarInitializer) {
    this.name = initializer.name;
    this.description = initializer.description;
  }
  
  public static instantiate(node: ScalarTypeDefinitionNode) {
    const name = node.name.value;
    if (this.collection[name]) return this.collection[name];
    
    return this.collection[name] = new this({name, description: node.description?.value});
  }
  
  public toString() {
    if (this.description) {
      return `type ${this.name} = any //${this.description}`;
    }
    return `type ${this.name} = any`;
  }
  
}

interface EntityScalarInitializer {
  name: string;
  description?: string;
}
