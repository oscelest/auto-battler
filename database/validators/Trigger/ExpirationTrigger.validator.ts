import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
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
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<ExpirationTriggerEntity>[];
  
}

const order_by_enum = ExpirationTriggerEntity.registerAsEnum("ExpirationTriggerSortOrder", ["id", "created_at", "updated_at", "expiration_type"]);
