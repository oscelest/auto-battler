import {Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import {Field, InterfaceType} from "type-graphql";
import {ActionType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";

@InterfaceType({implements: CoreEntity})
@Entity({abstract: true, discriminatorColumn: "type" as keyof ActionEntity})
export abstract class ActionEntity<E extends ActionEntity = any> extends CoreEntity<E> {
  
  @Field(() => ActionType)
  @Enum(() => ActionType)
  public type: ActionType;
  
  @Field()
  @Property()
  public periodic: boolean;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  protected constructor(type: ActionType, initializer: ActionEntityInitializer) {
    super(initializer);
    this.type = type;
    this.periodic = initializer.periodic ?? false;
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
  }
}

export interface ActionEntityInitializer extends CoreEntityInitializer {
  periodic?: boolean;
  modifier_list?: ModifierEntity[] | Collection<ModifierEntity>;
}

