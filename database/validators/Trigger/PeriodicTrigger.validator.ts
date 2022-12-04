import {IsEnum, IsNumber} from "class-validator";
import {Field, InputType} from "type-graphql";
import {PeriodicTriggerEntity} from "../../entities/Trigger";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {TriggerCreateValidator, TriggerUpdateValidator} from "./Trigger.validator";

@InputType()
export class PeriodicTriggerCreateValidator extends TriggerCreateValidator {
  
  @Field()
  @IsNumber()
  public interval!: number;
  
}

@InputType()
export class PeriodicTriggerUpdateValidator extends TriggerUpdateValidator {
  
  @Field({nullable: true})
  @IsNumber()
  public interval?: number;
  
}

@InputType()
export class PeriodicTriggerPaginationValidator extends CorePaginationValidator<PeriodicTriggerEntity> {
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<PeriodicTriggerEntity>[];
  
}

const order_by_enum = PeriodicTriggerEntity.registerAsEnum("PeriodicTriggerSortOrder", ["id", "created_at", "updated_at", "interval", "operation_list.id"]);
