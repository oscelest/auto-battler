import {Collection, Entity, Enum, ManyToMany, OneToMany, Property} from "@mikro-orm/core";
import {EffectAlignmentType} from "../../enums";
import {EffectActionEntity} from "../Action";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity} from "../Trigger";

@Entity()
export class EffectEntity extends CoreEntity<EffectEntity> {
  
  @Property()
  public name: string;
  
  @Property()
  public expires: boolean;
  
  @Property()
  public removable: boolean;
  
  @Enum(() => EffectAlignmentType)
  public alignment: EffectAlignmentType;
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  @ManyToMany(() => TriggerEntity)
  public trigger_list: Collection<TriggerEntity>;
  
  /* ----- Relations ----- */
  
  @OneToMany(() => EffectActionEntity, relation => relation.effect)
  public effect_action_list: Collection<EffectActionEntity>;
  
  constructor(initializer: EffectEntityInitializer) {
    super(initializer);
    this.name = initializer.name;
    this.expires = initializer.expires ?? false;
    this.removable = initializer.removable ?? false;
    this.alignment = initializer.alignment;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    this.trigger_list = initializer.trigger_list ?? new Collection<TriggerEntity>(this);
    
    this.effect_action_list = initializer.effect_action_list ?? new Collection<EffectActionEntity>(this);
  }
}

export interface EffectEntityInitializer extends CoreEntityInitializer {
  name: string;
  expires?: boolean;
  removable?: boolean;
  alignment: EffectAlignmentType;
  modifier_list?: Collection<ModifierEntity>;
  trigger_list?: Collection<TriggerEntity>;
  
  effect_action_list?: Collection<EffectActionEntity>;
}
