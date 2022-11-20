import {EffectEventType, UnitEventType} from "../../enums";
import {HealingReceivedTriggerEntity} from "../../generated/contract/entities/Trigger/HealingReceivedTrigger.entity";
import {UnitHealEvent} from "../Unit/Unit";
import Trigger, {TriggerInitializer} from "./Trigger";

export default class HealingReceivedTrigger extends Trigger<HealingReceivedTriggerEntity> {
  
  constructor(initializer: HealingReceivedTriggerInitializer) {
    super(initializer);
    
    this.effect.on(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.on(UnitEventType.HEALING_RECEIVED, this.onUnitHealingReceived);
  }
  
  private onEffectExpire = () => {
    this.effect.off(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.off(UnitEventType.DAMAGE_RECEIVED, this.onEffectExpire);
  };
  
  private readonly onUnitHealingReceived = (event: UnitHealEvent) => {
  
  };
  
}

export interface HealingReceivedTriggerInitializer extends TriggerInitializer<HealingReceivedTriggerEntity> {

}
