import TriggerType from "../../enums/Discriminator/TriggerType";
import {ModifierEntity} from "../Modifier";
import TriggerEntity, {TriggerEntityInitializer} from "./TriggerEntity";

export default class HealingReceivedTriggerEntity extends TriggerEntity {
  
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: HealingReceivedTriggerEntityInitializer) {
    super(TriggerType.HEALING_RECEIVED, initializer);
    this.modifier_list = initializer.modifier_list;
  }
}

export interface HealingReceivedTriggerEntityInitializer extends TriggerEntityInitializer {
  modifier_list: ModifierEntity[];
}
