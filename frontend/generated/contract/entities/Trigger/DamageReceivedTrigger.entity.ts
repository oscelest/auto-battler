import {ModifierEntity} from "../Modifier/Modifier.entity";
import {TriggerEntity} from "./Trigger.entity";

export interface DamageReceivedTriggerEntity extends TriggerEntity {
  modifier_list: ModifierEntity[];
}
