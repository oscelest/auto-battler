import {TriggerEntity} from "./Trigger.entity";

export interface PeriodicTriggerEntity extends TriggerEntity {
  interval: number;
}
