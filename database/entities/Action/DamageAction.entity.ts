import {Entity, Enum, Property} from "@mikro-orm/core";
import {Field, ObjectType, Resolver} from "type-graphql";
import {ActionType, DamageElementType, DamageSourceType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType({implements: [CoreEntity, ActionEntity]})
@Entity({discriminatorValue: ActionType.DAMAGE})
@Resolver(() => DamageActionEntity)
export class DamageActionEntity extends ActionEntity<DamageActionEntity> {
  
  @Field()
  @Property()
  public direct: boolean;
  
  @Field(() => DamageSourceType)
  @Enum(() => DamageSourceType)
  public damage_source: DamageSourceType;
  
  @Field(() => DamageElementType)
  @Enum(() => DamageElementType)
  public damage_element: DamageElementType;
  
  constructor(initializer: DamageActionEntityInitializer) {
    super(ActionType.DAMAGE, initializer);
    
    this.direct = initializer.direct ?? true;
    this.damage_source = initializer.damage_source;
    this.damage_element = initializer.damage_element;
  }
  
  
}

export const DamageActionPaginationOrder = DamageActionEntity.registerAsEnum(
  "DamageActionPaginationOrder",
  ["id", "created_at", "updated_at", "damage_source", "damage_element"]
);

export interface DamageActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
}
