import {IsEnum} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {ExpirationTriggerEntity} from "../../entities/Trigger";
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
  
  @Field(() => [ExpirationTriggerSortOrder], {nullable: true})
  @IsEnum(() => ExpirationTriggerSortOrder, {each: true})
  public order_by?: EntityOrderKey<ExpirationTriggerEntity>[];
  
}

const ExpirationTriggerSortOrder = ExpirationTriggerPaginationValidator.toEnumFromFieldList<ExpirationTriggerEntity>(["id", "created_at", "updated_at", "type", "expiration_type"]);
registerEnumType(ExpirationTriggerSortOrder, {name: "ExpirationTriggerSortOrder"});
