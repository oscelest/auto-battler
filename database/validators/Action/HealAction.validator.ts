import {IsBoolean, IsEnum} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {HealActionEntity} from "../../entities";
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
  
  @Field(() => [HealActionSortOrder], {nullable: true})
  @IsEnum(() => HealActionSortOrder, {each: true})
  public order_by?: EntityOrderKey<HealActionEntity>[];
  
}

const HealActionSortOrder = CorePaginationValidator.toEnumFromFieldList(["id", "created_at", "updated_at"]);
registerEnumType(HealActionSortOrder, {name: "HealActionSortOrder"});


