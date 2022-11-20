import {Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import {ActionType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import ModifierEntity from "../Modifier/Modifier.entity";
import OperationEntity from "../Operation/Operation.entity";

@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof ActionEntity
})
export abstract class ActionEntity extends CoreEntity<ActionEntity> {
  
  @Enum(() => ActionType)
  public type: ActionType;
  
  @Property()
  public periodic: boolean;
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => OperationEntity, relation => relation.action_list)
  public operation_list: Collection<OperationEntity>;
  
  protected constructor(type: ActionType, initializer: ActionEntityInitializer) {
    super(initializer);
    this.type = type;
    this.periodic = initializer.periodic ?? false;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    
    this.operation_list = initializer.operation ?? new Collection<OperationEntity>(this);
  }
}

export interface ActionEntityInitializer extends CoreEntityInitializer {
  periodic?: boolean;
  modifier_list?: Collection<ModifierEntity>;
  
  operation?: Collection<OperationEntity>;
}

