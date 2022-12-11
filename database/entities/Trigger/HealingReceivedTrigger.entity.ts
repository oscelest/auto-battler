import {Collection, Entity, ManyToMany} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TriggerType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@ObjectType({implements: [CoreEntity, TriggerEntity]})
@Entity({discriminatorValue: TriggerType.HEALING_RECEIVED})
export class HealingReceivedTriggerEntity extends TriggerEntity<HealingReceivedTriggerEntity> {
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  constructor(initializer: HealingReceivedTriggerEntityInitializer) {
    super(TriggerType.HEALING_RECEIVED, initializer);
    
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
  }
}

export const HealingReceivedTriggerPaginationOrder = HealingReceivedTriggerEntity.registerAsEnum(
  "HealingReceivedTriggerPaginationOrder",
  ["id", "created_at", "updated_at"]
);

export interface HealingReceivedTriggerEntityInitializer extends TriggerEntityInitializer {
  modifier_list?: ModifierEntity[] | Collection<ModifierEntity>;
}
