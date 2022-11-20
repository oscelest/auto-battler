import ModifierType from "../../enums/Modifier/ModifierType";
import UnitAttributeType from "../../enums/Unit/UnitAttributeType";
import {ModifierEntity} from "./index";
import {ModifierEntityInitializer} from "./ModifierEntity";

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
