import {Entity, Enum, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ModifierCategoryType, ModifierType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";

@ObjectType()
@Entity({
  abstract: true,
  discriminatorColumn: "type" as keyof ModifierEntity
})
export abstract class ModifierEntity extends CoreEntity<ModifierEntity> {
  
  @Field(() => ModifierType)
  @Enum(() => ModifierType)
  public type: ModifierType;
  
  @Field()
  @Property()
  public value: number;
  
  @Field()
  @Property()
  public value_per_level: number;
  
  @Field(() => ModifierCategoryType)
  @Enum(() => ModifierCategoryType)
  public category: ModifierCategoryType;
  
  /* ----- Relations ----- */
  
  // @ManyToMany(() => SkillEntity, relation => relation.modifier_list)
  // public skill_list: Collection<SkillEntity>;
  //
  // @ManyToMany(() => ActionEntity, relation => relation.modifier_list)
  // public action_list: Collection<ActionEntity>;
  //
  // @ManyToMany(() => EffectEntity, relation => relation.modifier_list)
  // public effect_list: Collection<EffectEntity>;
  //
  // @ManyToMany(() => OperationEntity, relation => relation.modifier_list)
  // public operation_list: Collection<OperationEntity>;
  //
  // @ManyToMany(() => UnitClassEntity, relation => relation.modifier_list)
  // public unit_class_list: Collection<UnitClassEntity>;
  
  protected constructor(type: ModifierType, initializer: ModifierEntityInitializer) {
    super(initializer);
    this.type = type;
    this.value = initializer.value;
    this.value_per_level = initializer.value_per_level ?? 0;
    this.category = initializer.category;
    
    // this.skill_list = initializer.skill ?? new Collection<SkillEntity>(this);
    // this.action_list = initializer.action ?? new Collection<ActionEntity>(this);
    // this.effect_list = initializer.effect ?? new Collection<EffectEntity>(this);
    // this.operation_list = initializer.operation ?? new Collection<OperationEntity>(this);
    // this.unit_class_list = initializer.unit_class ?? new Collection<UnitClassEntity>(this);
  }
}

export interface ModifierEntityInitializer extends CoreEntityInitializer {
  value: number;
  value_per_level?: number;
  category: ModifierCategoryType;
  
  // skill?: Collection<SkillEntity>;
  // action?: Collection<ActionEntity>;
  // effect?: Collection<EffectEntity>;
  // operation?: Collection<OperationEntity>;
  // unit_class?: Collection<UnitClassEntity>;
}
