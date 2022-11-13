import TriggerType from "../../enums/Encounter/TriggerType";
import TriggerEntity, {StatusEffectTriggerEntityInitializer} from "./TriggerEntity";

export default class PeriodicTriggerEntity extends TriggerEntity {

  public interval: number;

  constructor(initializer: PeriodicStatusEffectTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.interval = initializer.interval;
  }
}

export interface PeriodicStatusEffectTriggerEntityInitializer extends StatusEffectTriggerEntityInitializer {
  interval: number;
}
