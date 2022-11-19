import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import TriggerType from "../../../enums/Encounter/TriggerType";
import {CoreEntity, CoreEntityInitializer} from "../CoreEntity";
import {EffectEntity} from "../Effect";
import {OperationEntity} from "../Operation";

@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof TriggerEntity,
  discriminatorMap: {
    [TriggerType.DAMAGE_RECEIVED]: "DamageReceivedTriggerEntity",
    [TriggerType.EXPIRATION]: "ExpirationTriggerEntity",
    [TriggerType.HEALING_RECEIVED]: "HealingReceivedTriggerEntity",
    [TriggerType.PERIODIC]: "PeriodicTriggerEntity"
  }
})
export default abstract class TriggerEntity extends CoreEntity<TriggerEntity> {
  
  @Enum(() => TriggerType)
  public type: TriggerType;
  
  @ManyToMany(() => OperationEntity)
  public operation_list: Collection<OperationEntity>;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => EffectEntity, relation => relation.trigger_list)
  public effect_list: Collection<EffectEntity>;
  
  protected constructor(type: TriggerType, initializer: StatusEffectTriggerEntityInitializer) {
    super(initializer);
    
    this.type = type;
    this.operation_list = initializer.operation_list ?? new Collection<OperationEntity>(this);
    
    this.effect_list = initializer.effect_list ?? new Collection<EffectEntity>(this);
  }
}

export interface StatusEffectTriggerEntityInitializer extends CoreEntityInitializer {
  operation_list?: Collection<OperationEntity>;
  
  effect_list?: Collection<EffectEntity>;
}
