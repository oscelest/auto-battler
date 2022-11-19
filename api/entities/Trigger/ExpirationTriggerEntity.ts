import {Entity} from "@mikro-orm/core";
import EffectExpirationType from "../../../enums/Encounter/Effect/EffectExpirationType";
import TriggerType from "../../../enums/Encounter/TriggerType";
import TriggerEntity, {StatusEffectTriggerEntityInitializer} from "./TriggerEntity";

@Entity()
export default class ExpirationTriggerEntity extends TriggerEntity {
  
  public expiration_type: EffectExpirationType;
  
  constructor(initializer: ExpirationStatusEffectTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.expiration_type = initializer.expiration_type;
  }
}

export interface ExpirationStatusEffectTriggerEntityInitializer extends StatusEffectTriggerEntityInitializer {
  expiration_type: EffectExpirationType;
}
