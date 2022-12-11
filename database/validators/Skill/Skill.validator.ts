import {IsEnum, IsString, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {SkillEntity, SkillPaginationOrder} from "../../entities";
import {SkillType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";

@InputType()
export class SkillCreateValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field(() => SkillType)
  @IsEnum(SkillType)
  public type!: SkillType;
  
  @Field({nullable: true})
  @IsString()
  public description?: string;
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public operation_list?: string[];
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType()
export class SkillUpdateValidator {
  
  @Field({nullable: true})
  @IsString()
  public name?: string;
  
  @Field(() => SkillType, {nullable: true})
  @IsEnum(SkillType)
  public type?: SkillType;
  
  @Field({nullable: true})
  @IsString()
  public description?: string;
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public operation_list?: string[];
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
}

@InputType()
export class SkillPaginationValidator extends CorePaginationValidator<SkillEntity> {
  
  @Field(() => [SkillPaginationOrder], {nullable: true})
  @IsEnum(() => SkillPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<SkillEntity>[];
  
}
