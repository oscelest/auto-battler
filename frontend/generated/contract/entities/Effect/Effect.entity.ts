import {EffectAlignmentType} from "../../enums/Effect/EffectAlignmentType";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier/Modifier.entity";
import {TriggerEntity} from "../Trigger/Trigger.entity";

export interface EffectEntity extends CoreEntity {
  name: string;
  expires: boolean;
  removable: boolean;
  alignment: EffectAlignmentType;
  modifier_list: ModifierEntity[];
  trigger_list: TriggerEntity[];
}
