import {Entity, Enum, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ActionType, DamageElementType, DamageSourceType} from "../../enums";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType()
@Entity({
  discriminatorValue: ActionType.DAMAGE
})
export class DamageActionEntity extends ActionEntity {
  
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

export interface DamageActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
}
