import {Entity, ManyToMany} from "@mikro-orm/core";
import {TriggerType} from "../../enums";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@Entity({
  discriminatorValue: TriggerType.DAMAGE_RECEIVED
})
export class DamageReceivedTriggerEntity extends TriggerEntity {
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: DamageTakenTriggerEntityInitializer) {
    super(TriggerType.DAMAGE_RECEIVED, initializer);
    this.modifier_list = initializer.modifier_list;
  }
}

export interface DamageTakenTriggerEntityInitializer extends TriggerEntityInitializer {
  modifier_list: ModifierEntity[];
}
