import {Entity, ManyToMany} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TriggerType} from "../../enums";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@ObjectType()
@Entity({
  discriminatorValue: TriggerType.HEALING_RECEIVED
})
export class HealingReceivedTriggerEntity extends TriggerEntity {
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: HealingReceivedTriggerEntityInitializer) {
    super(TriggerType.HEALING_RECEIVED, initializer);
    this.modifier_list = initializer.modifier_list;
  }
}

export interface HealingReceivedTriggerEntityInitializer extends TriggerEntityInitializer {
  modifier_list: ModifierEntity[];
}
