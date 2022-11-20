import {EffectExpirationType} from "../../enums/Effect/EffectExpirationType";
import {TriggerEntity} from "./Trigger.entity";

export interface ExpirationTriggerEntity extends TriggerEntity {
  expiration_type: EffectExpirationType;
}
