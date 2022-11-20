import {ActionEntity} from "./Action.entity";

export interface HealActionEntity extends ActionEntity {
  direct: boolean;
  reviving: boolean;
}
