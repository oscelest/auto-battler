import {Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import {Field} from "type-graphql";
import {SkillType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {OperationEntity} from "../Operation";
import {UnitEntity} from "../Unit";

@Entity()
export class SkillEntity extends CoreEntity<SkillEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field()
  @Property()
  public description?: string;
  
  @Field(() => SkillType)
  @Enum(() => SkillType)
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
    this.description = initializer.description ?? "";
    this.type = initializer.type;
    this.operation_list = initializer.operation_list ?? new Collection<OperationEntity>(this);
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    
    this.unit_list = initializer.unit_list ?? new Collection<UnitEntity>(this);
  }
}

export interface SkillEntityInitializer extends CoreEntityInitializer {
  name: string;
  description?: string;
  type: SkillType;
  operation_list?: Collection<OperationEntity>;
  modifier_list?: Collection<ModifierEntity>;
  
  unit_list: Collection<UnitEntity>;
}
