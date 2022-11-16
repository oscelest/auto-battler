import TriggerType from "../../enums/Encounter/TriggerType";
import {OperationEntity} from "../Operation";

export default abstract class TriggerEntity {
  
  public type: TriggerType;
  public operation_list: OperationEntity[];
  
  protected constructor(type: TriggerType, initializer: StatusEffectTriggerEntityInitializer) {
    this.type = type;
    this.operation_list = initializer.operation_list ?? [];
  }
}

export interface StatusEffectTriggerEntityInitializer {
  operation_list?: OperationEntity[];
}
