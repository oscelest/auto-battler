import PeriodicTriggerEntity from "../../entities/Trigger/PeriodicTriggerEntity";
import {EffectEventType, EncounterEventType} from "../../enums";
import SourceType from "../../enums/SourceType";
import Operation from "../../modules/Operation";
import {Encounter} from "../Battle";
import Source from "../Source";
import Trigger, {TriggerInitializer} from "./Trigger";

export default class PeriodicTrigger extends Trigger<PeriodicTriggerEntity> {
  
  public current_interval: number;
  
  public readonly source: Source<SourceType.EFFECT>;
  
  constructor(initializer: PeriodicStatusEffectTriggerInitializer) {
    super(initializer);
    this.current_interval = initializer.current_interval ?? 0;
    this.source = new Source({type: SourceType.EFFECT, value: this.effect});
    
    this.effect.on(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
    
    
  }

  private onEffectExpire = () => {
  
    this.effect.off(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.encounter.off(EncounterEventType.PROGRESS, this.onEncounterProgress);
  };

  private onEncounterProgress = () => {
    if (this.entity.interval > 0) {
      this.current_interval += Encounter.tick_interval;
      if (this.current_interval < this.entity.interval) return;
      this.current_interval -= this.entity.interval;
    }

    for (let operation of this.entity.operation_list) {
      Operation.execute(operation, this.effect.unit, this.effect.source);
    }
  };

}

export interface PeriodicStatusEffectTriggerInitializer extends TriggerInitializer<PeriodicTriggerEntity> {
  current_interval?: number;
}
