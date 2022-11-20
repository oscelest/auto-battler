import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import {TargetType} from "../../enums";
import {ActionEntity} from "../Action";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {SkillEntity} from "../Skill";
import {TriggerEntity} from "../Trigger";

@Entity()
export class OperationEntity extends CoreEntity<OperationEntity> {
  
  @Enum(() => TargetType)
  public target: TargetType;
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  @ManyToMany(() => ActionEntity)
  public action_list: Collection<ActionEntity>;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => SkillEntity, relation => relation.operation_list)
  public skill_list?: Collection<SkillEntity>;
  
  @ManyToMany(() => TriggerEntity, relation => relation.operation_list)
  public trigger_list?: Collection<TriggerEntity>;
  
  constructor(initializer: OperationEntityInitializer) {
    super(initializer);
    
    this.target = initializer.target;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    this.action_list = initializer.action_list ?? new Collection<ActionEntity>(this);
    
    this.skill_list = initializer.skill_list ?? new Collection<SkillEntity>(this);
    this.trigger_list = initializer.trigger_list ?? new Collection<TriggerEntity>(this);
  }
}

export interface OperationEntityInitializer extends CoreEntityInitializer {
  target: TargetType;
  modifier_list?: Collection<ModifierEntity>;
  action_list?: Collection<ActionEntity>;
  
  skill_list?: Collection<SkillEntity>;
  trigger_list?: Collection<TriggerEntity>;
}
