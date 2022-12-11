import {IsBoolean, IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {HealActionEntity, HealActionPaginationOrder} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class HealActionCreateValidator extends ActionCreateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  public reviving?: boolean;
  
}

@InputType()
export class HealActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  public reviving?: boolean;
  
}

@InputType()
export class HealActionPaginationValidator extends CorePaginationValidator<HealActionEntity> {
  
  @Field(() => [HealActionPaginationOrder], {nullable: true})
  @IsEnum(() => HealActionPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<HealActionEntity>[];
  
}
