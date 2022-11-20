import {ActionEntity} from "./Action.entity";

export interface ComboPointActionEntity extends ActionEntity {
  base_value: number;
  retained: boolean;
}
