import TriggerType from "../../enums/Discriminator/TriggerType";
import EffectExpirationType from "../../enums/Effect/EffectExpirationType";
import TriggerEntity, {TriggerEntityInitializer} from "./TriggerEntity";

export default class ExpirationTriggerEntity extends TriggerEntity {
  
  public expiration_type: EffectExpirationType;
  
  constructor(initializer: ExpirationTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.expiration_type = initializer.expiration_type;
  }
}

export interface ExpirationTriggerEntityInitializer extends TriggerEntityInitializer {
  expiration_type: EffectExpirationType;
}
