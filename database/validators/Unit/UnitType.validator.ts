import {IsEnum, IsString, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {UnitTypeEntity} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";

@InputType()
export class UnitTypeCreateValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class UnitTypeUpdateValidator {
  
  @Field({nullable: true})
  @IsString()
  public name?: string;
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class UnitTypePaginationValidator extends CorePaginationValidator<UnitTypeEntity> {
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<UnitTypeEntity>[];
  
}

const order_by_enum = UnitTypeEntity.registerAsEnum("UnitTypeSortOrder", ["id", "created_at", "updated_at", "name"]);
