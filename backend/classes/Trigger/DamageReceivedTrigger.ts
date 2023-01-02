import {EffectEventType, UnitEventType} from "../../enums";
import {DamageReceivedTriggerEntity} from "../../gql/sdk";
import {UnitDamageEvent} from "../Unit/Unit";
import Trigger, {TriggerInitializer} from "./Trigger";

export default class DamageReceivedTrigger extends Trigger<DamageReceivedTriggerEntity> {
  
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

export interface DamageTakenTriggerInitializer extends TriggerInitializer<DamageReceivedTriggerEntity> {

}
