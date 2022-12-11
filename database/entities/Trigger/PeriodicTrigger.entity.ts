import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TriggerType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@ObjectType({implements: [CoreEntity, TriggerEntity]})
@Entity({discriminatorValue: TriggerType.PERIODIC})
export class PeriodicTriggerEntity extends TriggerEntity<PeriodicTriggerEntity> {
  
  @Field()
  @Property()
  public interval: number;
  
  constructor(initializer: PeriodicTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    
    this.interval = initializer.interval;
  }
}

export const PeriodicTriggerPaginationOrder = PeriodicTriggerEntity.registerAsEnum(
  "PeriodicTriggerPaginationOrder",
  ["id", "created_at", "updated_at", "interval"]
);

export interface PeriodicTriggerEntityInitializer extends TriggerEntityInitializer {
  interval: number;
}
