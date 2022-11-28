import {IsEnum, IsNumber} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
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
  
  @Field(() => [PeriodicTriggerSortOrder], {nullable: true})
  @IsEnum(() => PeriodicTriggerSortOrder, {each: true})
  public order_by?: EntityOrderKey<PeriodicTriggerEntity>[];
  
}

const PeriodicTriggerSortOrder = PeriodicTriggerPaginationValidator.toEnumFromFieldList<PeriodicTriggerEntity>(["id", "created_at", "updated_at", "interval"]);
registerEnumType(PeriodicTriggerSortOrder, {name: "PeriodicTriggerSortOrder"});
