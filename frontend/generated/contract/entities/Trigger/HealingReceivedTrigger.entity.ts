import {ModifierEntity} from "../Modifier/Modifier.entity";
import {TriggerEntity} from "./Trigger.entity";

export interface HealingReceivedTriggerEntity extends TriggerEntity {
  modifier_list: ModifierEntity[];
}
