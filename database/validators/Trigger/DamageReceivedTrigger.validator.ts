import {IsEnum, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {DamageReceivedTriggerEntity, DamageReceivedTriggerPaginationOrder} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {TriggerCreateValidator, TriggerUpdateValidator} from "./Trigger.validator";

@InputType()
export class DamageReceivedTriggerCreateValidator extends TriggerCreateValidator {
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class DamageReceivedTriggerUpdateValidator extends TriggerUpdateValidator {
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class DamageReceivedTriggerPaginationValidator extends CorePaginationValidator<DamageReceivedTriggerEntity> {
  
  @Field(() => [DamageReceivedTriggerPaginationOrder], {nullable: true})
  @IsEnum(() => DamageReceivedTriggerPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<DamageReceivedTriggerEntity>[];
  
}
