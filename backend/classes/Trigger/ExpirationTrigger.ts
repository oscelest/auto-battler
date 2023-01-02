import {EffectEventType} from "../../enums";
import {ExpirationTriggerEntity} from "../../gql/sdk";
import Trigger, {TriggerInitializer} from "./Trigger";

export default class ExpirationTrigger extends Trigger<ExpirationTriggerEntity> {
  
  constructor(initializer: ExpirationTriggerInitializer) {
    super(initializer);
    
    this.effect.on(EffectEventType.EXPIRE, this.onEffectExpire);
  }
  
  private onEffectExpire = () => {
    this.effect.off(EffectEventType.EXPIRE, this.onEffectExpire);
    
    //   const log_group = new LogGroup();
    //   if (this.entity.expiration_type !== expiration_type) return log_group;
    //
    //   const modifier_list = [...status_effect.source_unit.getModifierList(), ...status_effect.source_skill.getModifierList()];
    //   for (let effect of this.entity.operation_list) {
    //     log_group.incrementByGroup(loop.executeEffect(effect, modifier_list, unit, status_effect.source_unit, status_effect.source_skill));
    //   }
    //
    //   return log_group;
  };
}

export interface ExpirationTriggerInitializer extends TriggerInitializer<ExpirationTriggerEntity> {

}
