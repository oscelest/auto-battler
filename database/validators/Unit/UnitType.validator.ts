import {IsEnum, IsString, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {UnitTypeEntity, UnitTypePaginationOrder} from "../../entities";
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
  
  @Field(() => [UnitTypePaginationOrder], {nullable: true})
  @IsEnum(() => UnitTypePaginationOrder, {each: true})
  public order_by?: EntityOrderKey<UnitTypeEntity>[];
  
}
