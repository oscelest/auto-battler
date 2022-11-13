import ActionType from "../../enums/Encounter/ActionType";
import {ActionEntity, ActionEntityInitializer} from "./index";

export default class ComboPointActionEntity extends ActionEntity {

  public base_value: number;
  public chainable: boolean;

  constructor(initializer: ComboPointActionEntityInitializer) {
    super(ActionType.COMBO_POINT, initializer);

    this.base_value = initializer.base_value;
    this.chainable = initializer.chainable ?? false;
  }
}

export interface ComboPointActionEntityInitializer extends ActionEntityInitializer {
  base_value: number;
  chainable?: boolean;
}
