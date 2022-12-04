import {Entity, Enum, Property} from "@mikro-orm/core";
import {Field, InterfaceType} from "type-graphql";
import {ModifierCategoryType, ModifierType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";

@InterfaceType({isAbstract: true, implements: CoreEntity})
@Entity({abstract: true, discriminatorColumn: "type" as keyof ModifierEntity})
export abstract class ModifierEntity<E extends ModifierEntity = any> extends CoreEntity<E> {
  
  @Field(() => ModifierType)
  @Enum(() => ModifierType)
  public type: ModifierType;
  
  @Field(() => ModifierCategoryType)
  @Enum(() => ModifierCategoryType)
  public category: ModifierCategoryType;
  
  @Field()
  @Property()
  public value: number;
  
  @Field()
  @Property()
  public value_per_level: number;
  
  protected constructor(type: ModifierType, initializer: ModifierEntityInitializer) {
    super(initializer);
    
    this.type = type;
    this.category = initializer.category;
    this.value = initializer.value;
    this.value_per_level = initializer.value_per_level ?? 0;
  }
}

export interface ModifierEntityInitializer extends CoreEntityInitializer {
  category: ModifierCategoryType;
  value: number;
  value_per_level?: number;
}
