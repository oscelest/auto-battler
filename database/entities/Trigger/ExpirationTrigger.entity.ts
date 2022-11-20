import {Entity, Enum} from "@mikro-orm/core";
import {EffectExpirationType, TriggerType} from "../../enums";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@Entity({
  discriminatorValue: TriggerType.EXPIRATION
})
export class ExpirationTriggerEntity extends TriggerEntity {
  
  @Enum(() => EffectExpirationType)
  public expiration_type: EffectExpirationType;
  
  constructor(initializer: ExpirationTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.expiration_type = initializer.expiration_type;
  }
}

export interface ExpirationTriggerEntityInitializer extends TriggerEntityInitializer {
  expiration_type: EffectExpirationType;
}
