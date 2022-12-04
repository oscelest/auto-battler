import {Collection, Entity, ManyToMany} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TriggerType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@ObjectType({implements: [CoreEntity, TriggerEntity]})
@Entity({discriminatorValue: TriggerType.DAMAGE_RECEIVED})
export class DamageReceivedTriggerEntity extends TriggerEntity<DamageReceivedTriggerEntity> {
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  
  constructor(initializer: DamageTakenTriggerEntityInitializer) {
    super(TriggerType.DAMAGE_RECEIVED, initializer);
    
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
  }
}

export interface DamageTakenTriggerEntityInitializer extends TriggerEntityInitializer {
  modifier_list: ModifierEntity[] | Collection<ModifierEntity>;
}
