import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TriggerType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {OperationEntity} from "../Operation";

@ObjectType()
@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof TriggerEntity
})
export abstract class TriggerEntity extends CoreEntity<TriggerEntity> {
  
  @Field(() => TriggerType)
  @Enum(() => TriggerType)
  public type: TriggerType;
  
  @Field(() => [OperationEntity])
  @ManyToMany(() => OperationEntity)
  public operation_list: Collection<OperationEntity>;
  
  /* ----- Relations ----- */
  
  // @ManyToMany(() => EffectEntity, relation => relation.trigger_list)
  // public effect_list: Collection<EffectEntity>;
  
  protected constructor(type: TriggerType, initializer: TriggerEntityInitializer) {
    super(initializer);
    
    this.type = type;
    this.operation_list = initializer.operation_list ?? new Collection<OperationEntity>(this);
    
    // this.effect_list = initializer.effect_list ?? new Collection<EffectEntity>(this);
  }
}

export interface TriggerEntityInitializer extends CoreEntityInitializer {
  operation_list?: Collection<OperationEntity>;
  
  // effect_list?: Collection<EffectEntity>;
}
