import ModifierNumericalType from "../../enums/Modifier/ModifierNumericalType";
import ModifierType from "../../enums/Modifier/ModifierType";
import {ModifierEntity} from "./index";
import {ModifierEntityInitializer} from "./ModifierEntity";

export default class NumericalModifierEntity extends ModifierEntity {
  
  public numerical_type: ModifierNumericalType;
  
  constructor(initializer: NumericalModifierEntityInitializer) {
    super(ModifierType.NUMERICAL, initializer);
    this.numerical_type = initializer.numerical_type;
  }
}

export interface NumericalModifierEntityInitializer extends ModifierEntityInitializer {
  numerical_type: ModifierNumericalType;
}
