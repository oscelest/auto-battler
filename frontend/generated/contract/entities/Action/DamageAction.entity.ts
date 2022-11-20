import {DamageElementType} from "../../enums/Damage/DamageElementType";
import {DamageSourceType} from "../../enums/Damage/DamageSourceType";
import {ActionEntity} from "./Action.entity";

export interface DamageActionEntity extends ActionEntity {
  direct: boolean;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
}
