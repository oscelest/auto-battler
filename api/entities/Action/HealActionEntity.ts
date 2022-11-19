import {Entity, Property} from "@mikro-orm/core";
import ActionType from "../../../enums/Encounter/ActionType";
import {ActionEntity, ActionEntityInitializer} from "./index";

@Entity()
export default class HealActionEntity extends ActionEntity {
  
  @Property()
  public direct: boolean;
  
  @Property()
  public periodic: boolean;
  
  @Property()
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
