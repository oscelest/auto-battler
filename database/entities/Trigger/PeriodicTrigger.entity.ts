import {Entity, Property} from "@mikro-orm/core";
import {TriggerType} from "../../enums/Discriminator/TriggerType";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@Entity({
  discriminatorValue: TriggerType.PERIODIC
})
export class PeriodicTriggerEntity extends TriggerEntity {
  
  @Property()
  public interval: number;
  
  constructor(initializer: PeriodicTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.interval = initializer.interval;
  }
}

export interface PeriodicTriggerEntityInitializer extends TriggerEntityInitializer {
  interval: number;
}
