import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TriggerType} from "../../enums";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@ObjectType()
@Entity({
  discriminatorValue: TriggerType.PERIODIC
})
export class PeriodicTriggerEntity extends TriggerEntity {
  
  @Field()
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
