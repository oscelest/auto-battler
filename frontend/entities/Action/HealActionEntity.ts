import ActionType from "../../enums/Discriminator/ActionType";
import {ActionEntityInitializer} from "./ActionEntity";
import {ActionEntity} from "./index";

export default class HealActionEntity extends ActionEntity {
  
  public direct: boolean;
  public periodic: boolean;
  public reviving: boolean;
  
  constructor(initializer: HealActionEntityInitializer) {
    super(ActionType.HEAL, initializer);
    this.direct = initializer.direct ?? true;
    this.periodic = initializer.periodic ?? false;
    this.reviving = initializer.reviving ?? false;
  }
}

export interface HealActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  periodic?: boolean;
  reviving?: boolean;
}
