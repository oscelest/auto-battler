import ActionType from "../../enums/ActionType";
import {ActionEntity, ActionEntityInitializer} from "./index";

export default class HealActionEntity extends ActionEntity {

  public reviving: boolean;

  constructor(initializer: HealActionEntityInitializer) {
    super(ActionType.HEAL, initializer);
    this.reviving = initializer.reviving ?? false;
  }
}

export interface HealActionEntityInitializer extends ActionEntityInitializer {
  reviving?: boolean;
}
