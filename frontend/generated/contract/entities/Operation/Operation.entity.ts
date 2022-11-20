import {TargetType} from "../../enums/TargetType";
import {ActionEntity} from "../Action/Action.entity";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier/Modifier.entity";

export interface OperationEntity extends CoreEntity {
  target: TargetType;
  modifier_list: ModifierEntity[];
  action_list: ActionEntity[];
}
