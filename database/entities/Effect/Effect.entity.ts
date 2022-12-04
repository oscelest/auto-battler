import {Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {EffectAlignmentType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity} from "../Trigger";

@ObjectType({implements: CoreEntity})
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
  
  constructor(initializer: EffectEntityInitializer) {
    super(initializer);
    this.name = initializer.name;
    this.expires = initializer.expires ?? false;
    this.removable = initializer.removable ?? false;
    this.alignment = initializer.alignment;
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
    this.trigger_list = this.toCollectionFromList(initializer.trigger_list);
  }
}

export interface EffectEntityInitializer extends CoreEntityInitializer {
  name: string;
  expires?: boolean;
  removable?: boolean;
  alignment: EffectAlignmentType;
  modifier_list?: Collection<ModifierEntity>;
  trigger_list?: Collection<TriggerEntity>;
}
