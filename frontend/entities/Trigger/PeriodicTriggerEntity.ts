import TriggerType from "../../enums/Discriminator/TriggerType";
import TriggerEntity, {TriggerEntityInitializer} from "./TriggerEntity";

export default class PeriodicTriggerEntity extends TriggerEntity {
  
  public interval: number;
  
  constructor(initializer: PeriodicTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.interval = initializer.interval;
  }
}

export interface PeriodicTriggerEntityInitializer extends TriggerEntityInitializer {
  interval: number;
}
