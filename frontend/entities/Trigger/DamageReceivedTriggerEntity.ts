import TriggerType from "../../enums/Discriminator/TriggerType";
import {ModifierEntity} from "../Modifier";
import TriggerEntity, {TriggerEntityInitializer} from "./TriggerEntity";

export default class DamageReceivedTriggerEntity extends TriggerEntity {
  
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: DamageReceivedTriggerEntityInitializer) {
    super(TriggerType.DAMAGE_RECEIVED, initializer);
    this.modifier_list = initializer.modifier_list;
  }
}

export interface DamageReceivedTriggerEntityInitializer extends TriggerEntityInitializer {
  modifier_list: ModifierEntity[];
}
