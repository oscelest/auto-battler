import ActionType from "../../enums/Encounter/ActionType";
import DamageElementType from "../../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../../enums/Encounter/Damage/DamageSourceType";
import {ActionEntityInitializer} from "./ActionEntity";
import {ActionEntity} from "./index";

export default class DamageActionEntity extends ActionEntity {
  
  public direct: boolean;
  public periodic: boolean;
  public damage_source: DamageSourceType;
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
