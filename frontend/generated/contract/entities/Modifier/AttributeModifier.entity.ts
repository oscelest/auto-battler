import {UnitAttributeType} from "../../enums/Unit/UnitAttributeType";
import {ModifierEntity} from "./Modifier.entity";

export interface AttributeModifierEntity extends ModifierEntity {
  attribute: UnitAttributeType;
}
