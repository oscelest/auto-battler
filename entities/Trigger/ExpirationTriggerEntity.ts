import EffectExpirationType from "../../enums/StatusEffect/EffectExpirationType";
import TriggerType from "../../enums/StatusEffect/TriggerType";
import TriggerEntity, {StatusEffectTriggerEntityInitializer} from "./TriggerEntity";

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
