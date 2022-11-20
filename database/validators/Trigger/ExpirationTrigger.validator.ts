import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {EffectExpirationType} from "../../enums/Effect/EffectExpirationType";
import TriggerValidator from "./Trigger.validator";

@InputType()
export default class ExpirationTriggerValidator extends TriggerValidator {
  
  @Field(() => EffectExpirationType)
  @IsEnum(EffectExpirationType)
  public expiration_type!: EffectExpirationType;
  
}
