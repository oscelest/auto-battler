import ActionType from "../../enums/Encounter/ActionType";
import {ActionEntity, ActionEntityInitializer} from "./index";

export default class ComboPointActionEntity extends ActionEntity {
  
  public base_value: number;
  public retained: boolean;
  public periodic: boolean;
  
  constructor(initializer: ComboPointActionEntityInitializer) {
    super(ActionType.COMBO_POINT, initializer);
    
    this.base_value = initializer.base_value;
    this.retained = initializer.retained ?? false;
    this.periodic = initializer.periodic ?? false;
  }
}

export interface ComboPointActionEntityInitializer extends ActionEntityInitializer {
  base_value: number;
  retained?: boolean;
  periodic?: boolean;
}
