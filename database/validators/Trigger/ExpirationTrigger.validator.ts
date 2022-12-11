import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ExpirationTriggerEntity, ExpirationTriggerPaginationOrder} from "../../entities";
import {EffectExpirationType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {TriggerCreateValidator, TriggerUpdateValidator} from "./Trigger.validator";

@InputType()
export class ExpirationTriggerCreateValidator extends TriggerCreateValidator {
  
  @Field(() => EffectExpirationType)
  @IsEnum(EffectExpirationType)
  public expiration_type!: EffectExpirationType;
  
}

@InputType()
export class ExpirationTriggerUpdateValidator extends TriggerUpdateValidator {
  
  @Field(() => EffectExpirationType, {nullable: true})
  @IsEnum(EffectExpirationType)
  public expiration_type?: EffectExpirationType;
  
}

@InputType()
export class ExpirationTriggerPaginationValidator extends CorePaginationValidator<ExpirationTriggerEntity> {
  
  @Field(() => [ExpirationTriggerPaginationOrder], {nullable: true})
  @IsEnum(() => ExpirationTriggerPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<ExpirationTriggerEntity>[];
  
}
