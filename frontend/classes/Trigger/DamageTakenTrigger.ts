import {DamageTakenTriggerEntity} from "../../entities/Trigger";
import {EffectEventType, UnitEventType} from "../../enums";
import {UnitDamageEvent} from "../Unit/Unit";
import Trigger, {TriggerInitializer} from "./Trigger";

export default class DamageTakenTrigger extends Trigger<DamageTakenTriggerEntity> {
  
  constructor(initializer: DamageTakenTriggerInitializer) {
    super(initializer);
    
    this.effect.on(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.on(UnitEventType.DAMAGE_RECEIVED, this.onUnitDamageTaken);
  }
  
  private onEffectExpire = () => {
    this.effect.off(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.off(UnitEventType.DAMAGE_RECEIVED, this.onEffectExpire);
  };
  
  private readonly onUnitDamageTaken = (event: UnitDamageEvent) => {
  
  };
  
}

export interface DamageTakenTriggerInitializer extends TriggerInitializer<DamageTakenTriggerEntity> {

}
