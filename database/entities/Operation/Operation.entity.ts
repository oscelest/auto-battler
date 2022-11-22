import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TargetType} from "../../enums";
import {ActionEntity} from "../Action";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";

@ObjectType({implements: CoreEntity})
@Entity()
export class OperationEntity extends CoreEntity<OperationEntity> {
  
  @Field(() => TargetType)
  @Enum(() => TargetType)
  public target: TargetType;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  @Field(() => [ActionEntity])
  @ManyToMany(() => ActionEntity)
  public action_list: Collection<ActionEntity>;
  
  constructor(initializer: OperationEntityInitializer) {
    super(initializer);
    
    this.target = initializer.target;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    this.action_list = initializer.action_list ?? new Collection<ActionEntity>(this);
  }
}

export interface OperationEntityInitializer extends CoreEntityInitializer {
  target: TargetType;
  modifier_list?: Collection<ModifierEntity>;
  action_list?: Collection<ActionEntity>;
  
  // skill_list?: Collection<SkillEntity>;
  // trigger_list?: Collection<TriggerEntity>;
}
