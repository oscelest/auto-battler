import {Entity, Enum} from "@mikro-orm/core";
import ModifierType from "../../../enums/Encounter/Modifier/ModifierType";
import UnitAttributeType from "../../../enums/Encounter/Unit/UnitAttributeType";
import {ModifierEntity, ModifierEntityInitializer} from "./index";

@Entity()
export default class AttributeModifierEntity extends ModifierEntity {
  
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
