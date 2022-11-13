import ModifierNumericalType from "../../enums/Encounter/Modifier/ModifierNumericalType";
import ModifierType from "../../enums/Encounter/Modifier/ModifierType";
import {ModifierEntity, ModifierEntityInitializer} from "./index";

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
