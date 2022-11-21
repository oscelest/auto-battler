import {Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {EffectAlignmentType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity} from "../Trigger";

@ObjectType()
@Entity()
export class EffectEntity extends CoreEntity<EffectEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field()
  @Property()
  public expires: boolean;
  
  @Field()
  @Property()
  public removable: boolean;
  
  @Field(() => EffectAlignmentType)
  @Enum(() => EffectAlignmentType)
  public alignment: EffectAlignmentType;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  @Field(() => [TriggerEntity])
  @ManyToMany(() => TriggerEntity)
  public trigger_list: Collection<TriggerEntity>;
  
  /* ----- Relations ----- */
  
  // @OneToMany(() => EffectActionEntity, relation => relation.effect)
  // public effect_action_list: Collection<EffectActionEntity>;
  
  constructor(initializer: EffectEntityInitializer) {
    super(initializer);
    this.name = initializer.name;
    this.expires = initializer.expires ?? false;
    this.removable = initializer.removable ?? false;
    this.alignment = initializer.alignment;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    this.trigger_list = initializer.trigger_list ?? new Collection<TriggerEntity>(this);
    
    // this.effect_action_list = initializer.effect_action_list ?? new Collection<EffectActionEntity>(this);
  }
}

export interface EffectEntityInitializer extends CoreEntityInitializer {
  name: string;
  expires?: boolean;
  removable?: boolean;
  alignment: EffectAlignmentType;
  modifier_list?: Collection<ModifierEntity>;
  trigger_list?: Collection<TriggerEntity>;
  
  // effect_action_list?: Collection<EffectActionEntity>;
}
