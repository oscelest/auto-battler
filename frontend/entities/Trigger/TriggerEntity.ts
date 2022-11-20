import TriggerType from "../../enums/Discriminator/TriggerType";
import {OperationEntity} from "../Operation";

export default abstract class TriggerEntity {
  
  public type: TriggerType;
  public operation_list: OperationEntity[];
  
  protected constructor(type: TriggerType, initializer: TriggerEntityInitializer) {
    this.type = type;
    this.operation_list = initializer.operation_list ?? [];
  }
}

export interface TriggerEntityInitializer {
  operation_list?: OperationEntity[];
}
