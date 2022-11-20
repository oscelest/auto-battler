import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier/Modifier.entity";

export interface UnitClassEntity extends CoreEntity {
  name: string;
  modifier_list: ModifierEntity[];
}
