import {Entity, Property} from "@mikro-orm/core";
import {ActionType, DamageElementType, DamageSourceType} from "../../enums";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@Entity({
  discriminatorValue: ActionType.DAMAGE
})
export class DamageActionEntity extends ActionEntity {
  
  @Property()
  public direct: boolean;
  
  @Property()
  public damage_source: DamageSourceType;
  
  @Property()
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
