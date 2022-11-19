import {Collection, Enum, ManyToMany, Property} from "@mikro-orm/core";
import SkillType from "../../../enums/Encounter/SkillType";
import TriggerType from "../../../enums/Encounter/TriggerType";
import {CoreEntity, CoreEntityInitializer} from "../CoreEntity";
import {ModifierEntity} from "../Modifier";
import {OperationEntity} from "../Operation";
import {UnitEntity} from "../Unit";

export default class SkillEntity extends CoreEntity<SkillEntity> {
  
  @Property()
  public name: string;
  
  @Enum(() => TriggerType)
  public type: SkillType;
  
  @ManyToMany(() => OperationEntity)
  public operation_list: Collection<OperationEntity>;
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => UnitEntity, relation => relation.skill_list)
  public unit_list?: Collection<UnitEntity>;
  
  constructor(initializer: SkillEntityInitializer) {
    super(initializer);
    this.name = initializer.name;
    this.type = initializer.type;
    this.operation_list = initializer.operation_list ?? new Collection<OperationEntity>(this);
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    
    this.unit_list = initializer.unit_list ?? new Collection<UnitEntity>(this);
  }
}

export interface SkillEntityInitializer extends CoreEntityInitializer {
  name: string;
  type: SkillType;
  operation_list?: Collection<OperationEntity>;
  modifier_list?: Collection<ModifierEntity>;
  
  unit_list: Collection<UnitEntity>;
}
