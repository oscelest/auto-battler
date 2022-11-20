import {ActionType} from "../../enums/Discriminator/ActionType";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier/Modifier.entity";

export interface ActionEntity extends CoreEntity {
  type: ActionType;
  periodic: boolean;
  modifier_list: ModifierEntity[];
}
