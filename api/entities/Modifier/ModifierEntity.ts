import {Cascade, Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import ModifierCategoryType from "../../../enums/Encounter/Modifier/ModifierCategoryType";
import ModifierType from "../../../enums/Encounter/Modifier/ModifierType";
import {ActionEntity} from "../Action";
import {CoreEntity, CoreEntityInitializer} from "../CoreEntity";
import {EffectEntity} from "../Effect";
import {OperationEntity} from "../Operation";
import {SkillEntity} from "../Skill";
import {UnitClassEntity} from "../Unit";

@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof ModifierEntity,
  discriminatorMap: {
    [ModifierType.ATTRIBUTE]: "AttributeModifierEntity",
    [ModifierType.NUMERICAL]: "NumericalModifierEntity"
  }
})
export default abstract class ModifierEntity extends CoreEntity<ModifierEntity> {
  
  @Enum(() => ModifierType)
  public type: ModifierType;
  
  @Property()
  public value: number;
  
  @Property()
  public value_per_level: number;
  
  @Enum(() => ModifierCategoryType)
  public category: ModifierCategoryType;
  
  /* ----- Relations ----- */
  
  @ManyToMany(() => SkillEntity, relation => relation.modifier_list, {cascade: [Cascade.PERSIST, Cascade.REMOVE]})
  public skill_list: Collection<SkillEntity>;
  
  @ManyToMany(() => ActionEntity, relation => relation.modifier_list, {cascade: [Cascade.PERSIST, Cascade.REMOVE]})
  public action_list: Collection<ActionEntity>;
  
  @ManyToMany(() => EffectEntity, relation => relation.modifier_list, {cascade: [Cascade.PERSIST, Cascade.REMOVE]})
  public effect_list: Collection<EffectEntity>;
  
  @ManyToMany(() => OperationEntity, relation => relation.modifier_list, {cascade: [Cascade.PERSIST, Cascade.REMOVE]})
  public operation_list: Collection<OperationEntity>;
  
  @ManyToMany(() => UnitClassEntity, relation => relation.modifier_list, {cascade: [Cascade.PERSIST, Cascade.REMOVE]})
  public unit_class_list: Collection<UnitClassEntity>;
  
  protected constructor(type: ModifierType, initializer: ModifierEntityInitializer) {
    super(initializer);
    this.type = type;
    this.value = initializer.value;
    this.value_per_level = initializer.value_per_level ?? 0;
    this.category = initializer.category;
    
    this.skill_list = initializer.skill ?? new Collection<SkillEntity>(this);
    this.action_list = initializer.action ?? new Collection<ActionEntity>(this);
    this.effect_list = initializer.effect ?? new Collection<EffectEntity>(this);
    this.operation_list = initializer.operation ?? new Collection<OperationEntity>(this);
    this.unit_class_list = initializer.unit_class ?? new Collection<UnitClassEntity>(this);
  }
}

export interface ModifierEntityInitializer extends CoreEntityInitializer {
  value: number;
  value_per_level?: number;
  category: ModifierCategoryType;
  
  skill?: Collection<SkillEntity>;
  action?: Collection<ActionEntity>;
  effect?: Collection<EffectEntity>;
  operation?: Collection<OperationEntity>;
  unit_class?: Collection<UnitClassEntity>;
}
