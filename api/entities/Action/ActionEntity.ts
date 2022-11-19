import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import ActionType from "../../../enums/Encounter/ActionType";
import {CoreEntity, CoreEntityInitializer} from "../CoreEntity";
import {ModifierEntity} from "../Modifier";
import {OperationEntity} from "../Operation";

@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof ActionEntity,
  discriminatorMap: {
    [ActionType.COMBO_POINT]: "ComboPointActionEntity",
    [ActionType.DAMAGE]: "DamageActionEntity",
    [ActionType.EFFECT]: "EffectActionEntity",
    [ActionType.HEAL]: "HealActionEntity"
  }
})
export default abstract class ActionEntity extends CoreEntity<ActionEntity> {
  
  @Enum(() => ActionType)
  public type: ActionType;
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => OperationEntity, relation => relation.action_list)
  public operation_list: Collection<OperationEntity>;
  
  protected constructor(type: ActionType, initializer: ActionEntityInitializer) {
    super(initializer);
    this.type = type;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    
    this.operation_list = initializer.operation ?? new Collection<OperationEntity>(this);
  }
}

export interface ActionEntityInitializer extends CoreEntityInitializer {
  modifier_list?: Collection<ModifierEntity>;
  
  operation?: Collection<OperationEntity>;
}
