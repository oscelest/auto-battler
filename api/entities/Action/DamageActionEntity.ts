import {Entity, Property} from "@mikro-orm/core";
import ActionType from "../../../enums/Encounter/ActionType";
import DamageElementType from "../../../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../../../enums/Encounter/Damage/DamageSourceType";
import {ActionEntity, ActionEntityInitializer} from "./index";

@Entity()
export default class DamageActionEntity extends ActionEntity {
  
  @Property()
  public direct: boolean;
  
  @Property()
  public periodic: boolean;
  
  @Property()
  public damage_source: DamageSourceType;
  
  @Property()
  public damage_element: DamageElementType;
  
  constructor(initializer: DamageActionEntityInitializer) {
    super(ActionType.DAMAGE, initializer);
    
    this.direct = initializer.direct ?? true;
    this.periodic = initializer.periodic ?? false;
    this.damage_source = initializer.damage_source;
    this.damage_element = initializer.damage_element;
  }
}

export interface DamageActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  periodic?: boolean;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
}
