import {ModifierNumericalType} from "../../enums/Modifier/ModifierNumericalType";
import {ModifierEntity} from "./Modifier.entity";

export interface NumericalModifierEntity extends ModifierEntity {
  numerical_type: ModifierNumericalType;
}
