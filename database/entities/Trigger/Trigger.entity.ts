import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import {Field, InterfaceType} from "type-graphql";
import {TriggerType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {OperationEntity} from "../Operation";

@InterfaceType({implements: CoreEntity})
@Entity({abstract: true, discriminatorColumn: "type" as keyof TriggerEntity})
export abstract class TriggerEntity<E extends TriggerEntity = any> extends CoreEntity<E> {
  
  @Field(() => TriggerType)
  @Enum(() => TriggerType)
  public type: TriggerType;
  
  @Field(() => [OperationEntity])
  @ManyToMany(() => OperationEntity)
  public operation_list: Collection<OperationEntity>;
  
  
  protected constructor(type: TriggerType, initializer: TriggerEntityInitializer) {
    super(initializer);
    
    this.type = type;
    this.operation_list = this.toCollectionFromList(initializer.operation_list);
  }
}

export interface TriggerEntityInitializer extends CoreEntityInitializer {
  operation_list?: OperationEntity[] | Collection<OperationEntity>;
}
