import TriggerType from "../../enums/Encounter/Effect/TriggerType";
import {ModifierEntity} from "../Modifier";
import TriggerEntity, {StatusEffectTriggerEntityInitializer} from "./TriggerEntity";

export default class HealingReceivedTriggerEntity extends TriggerEntity {

  public modifier_list: ModifierEntity[];

  constructor(initializer: HealingReceivedStatusEffectTriggerEntityInitializer) {
    super(TriggerType.HEALING_RECEIVED, initializer);
    this.modifier_list = initializer.modifier_list;
  }
}

export interface HealingReceivedStatusEffectTriggerEntityInitializer extends StatusEffectTriggerEntityInitializer {
  modifier_list: ModifierEntity[];
}
