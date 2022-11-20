import {TriggerType} from "../../enums/Discriminator/TriggerType";
import {CoreEntity} from "../Core.entity";
import {OperationEntity} from "../Operation/Operation.entity";

export interface TriggerEntity extends CoreEntity {
  type: TriggerType;
  operation_list: OperationEntity[];
}

export function isTriggerEntity(object: any): object is TriggerEntity {
  return "entity" in object;
}
