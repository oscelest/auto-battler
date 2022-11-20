import {Entity, Enum} from "@mikro-orm/core";
import {ModifierType, UnitAttributeType} from "../../../enums";
import {ModifierEntity, ModifierEntityInitializer} from "./Modifier.entity";

@Entity({
  discriminatorValue: ModifierType.ATTRIBUTE
})
export class AttributeModifierEntity extends ModifierEntity {
  
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
