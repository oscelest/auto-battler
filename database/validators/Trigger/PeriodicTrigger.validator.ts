import {IsEnum, IsNumber} from "class-validator";
import {Field, InputType} from "type-graphql";
import {PeriodicTriggerEntity, PeriodicTriggerPaginationOrder} from "../../entities";
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
  
  @Field(() => [PeriodicTriggerPaginationOrder], {nullable: true})
  @IsEnum(() => PeriodicTriggerPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<PeriodicTriggerEntity>[];
  
}
