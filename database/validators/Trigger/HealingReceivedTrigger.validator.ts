import {IsEnum, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {HealingReceivedTriggerEntity} from "../../entities/Trigger";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {TriggerCreateValidator, TriggerUpdateValidator} from "./Trigger.validator";


@InputType()
export class HealingReceivedTriggerCreateValidator extends TriggerCreateValidator {
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class HealingReceivedTriggerUpdateValidator extends TriggerUpdateValidator {
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class HealingReceivedTriggerPaginationValidator extends CorePaginationValidator<HealingReceivedTriggerEntity> {
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<HealingReceivedTriggerEntity>[];
  
}

const order_by_enum = HealingReceivedTriggerEntity.registerAsEnum("HealingReceivedTriggerSortOrder", ["id", "created_at", "updated_at"]);
