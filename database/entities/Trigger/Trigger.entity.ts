import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import {TriggerType} from "../../enums/Discriminator/TriggerType";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {EffectEntity} from "../Effect";
import {OperationEntity} from "../Operation";

@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof TriggerEntity
})
export abstract class TriggerEntity extends CoreEntity<TriggerEntity> {
  
  @Enum(() => TriggerType)
  public type: TriggerType;
  
  @ManyToMany(() => OperationEntity)
  public operation_list: Collection<OperationEntity>;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => EffectEntity, relation => relation.trigger_list)
  public effect_list: Collection<EffectEntity>;
  
  protected constructor(type: TriggerType, initializer: TriggerEntityInitializer) {
    super(initializer);
    
    this.type = type;
    this.operation_list = initializer.operation_list ?? new Collection<OperationEntity>(this);
    
    this.effect_list = initializer.effect_list ?? new Collection<EffectEntity>(this);
  }
}

export interface TriggerEntityInitializer extends CoreEntityInitializer {
  operation_list?: Collection<OperationEntity>;
  
  effect_list?: Collection<EffectEntity>;
}
