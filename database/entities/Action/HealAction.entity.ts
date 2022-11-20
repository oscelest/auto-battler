import {Entity, Property} from "@mikro-orm/core";
import {ActionType} from "../../enums";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@Entity({
  discriminatorValue: ActionType.HEAL
})
export class HealActionEntity extends ActionEntity {
  
  @Property()
  public direct: boolean;
  
  @Property()
  public reviving: boolean;
  
  constructor(initializer: HealActionEntityInitializer) {
    super(ActionType.HEAL, initializer);
    this.direct = initializer.direct ?? true;
    this.reviving = initializer.reviving ?? false;
  }
}

export interface HealActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  reviving?: boolean;
}
