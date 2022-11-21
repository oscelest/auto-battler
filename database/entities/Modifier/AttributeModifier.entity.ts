import {Entity, Enum} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ModifierType, UnitAttributeType} from "../../enums";
import {ModifierEntity, ModifierEntityInitializer} from "./Modifier.entity";

@ObjectType()
@Entity({
  discriminatorValue: ModifierType.ATTRIBUTE
})
export class AttributeModifierEntity extends ModifierEntity {
  
  @Field(() => UnitAttributeType)
  @Enum(() => UnitAttributeType)
  public attribute: UnitAttributeType;
  
  constructor(initializer: AttributeModifierEntityInitializer) {
    super(ModifierType.ATTRIBUTE, initializer);
    
    this.attribute = initializer.attribute;
  }
}

export interface AttributeModifierEntityInitializer extends ModifierEntityInitializer {
  attribute: UnitAttributeType;
}
