import TriggerType from "../../enums/Encounter/TriggerType";
import {ModifierEntity} from "../Modifier";
import TriggerEntity, {StatusEffectTriggerEntityInitializer} from "./TriggerEntity";

export default class DamageTakenTriggerEntity extends TriggerEntity {
  
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: DamageTakenStatusEffectTriggerEntityInitializer) {
    super(TriggerType.DAMAGE_RECEIVED, initializer);
    this.modifier_list = initializer.modifier_list;
  }
}

export interface DamageTakenStatusEffectTriggerEntityInitializer extends StatusEffectTriggerEntityInitializer {
  modifier_list: ModifierEntity[];
}
