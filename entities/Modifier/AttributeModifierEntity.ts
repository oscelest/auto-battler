import ModifierType from "../../enums/Encounter/Modifier/ModifierType";
import UnitAttributeType from "../../enums/Encounter/Unit/UnitAttributeType";
import {ModifierEntity, ModifierEntityInitializer} from "./index";

export default class AttributeModifierEntity extends ModifierEntity {
  
  public attribute: UnitAttributeType;
  
  constructor(initializer: AttributeModifierEntityInitializer) {
    super(ModifierType.ATTRIBUTE, initializer);
    this.attribute = initializer.attribute;
  }
}

export interface AttributeModifierEntityInitializer extends ModifierEntityInitializer {
  attribute: UnitAttributeType;
}
