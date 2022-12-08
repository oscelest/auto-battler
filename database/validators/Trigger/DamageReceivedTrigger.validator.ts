import {IsEnum, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {DamageReceivedTriggerEntity} from "../../entities/Trigger";
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
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<DamageReceivedTriggerEntity>[];
  
}

const order_by_enum = DamageReceivedTriggerEntity.registerAsEnum("DamageReceivedTriggerSortOrder", ["id", "created_at", "updated_at"]);
