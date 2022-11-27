import {Entity, Enum} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {AttributeType, ModifierType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity, ModifierEntityInitializer} from "./Modifier.entity";

@ObjectType({implements: [CoreEntity, ModifierEntity]})
@Entity({discriminatorValue: ModifierType.ATTRIBUTE})
export class AttributeModifierEntity extends ModifierEntity {
  
  @Field(() => AttributeType)
  @Enum(() => AttributeType)
  public attribute: AttributeType;
  
  constructor(initializer: AttributeModifierEntityInitializer) {
    super(ModifierType.ATTRIBUTE, initializer);
    
    this.attribute = initializer.attribute;
  }
}

export interface AttributeModifierEntityInitializer extends ModifierEntityInitializer {
  attribute: AttributeType;
}
