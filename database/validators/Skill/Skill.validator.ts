import {IsEnum, IsString} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {SkillEntity} from "../../entities";
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
  
}

@InputType()
export class SkillUpdateValidator {
  
  @Field({nullable: true})
  @IsString()
  public name?: string;
  
  @Field(() => SkillType, {nullable: true})
  @IsEnum(SkillType)
  public type?: SkillType;
  
}

@InputType()
export class SkillPaginationValidator extends CorePaginationValidator<SkillEntity> {
  
  @Field(() => [SkillSortOrder], {nullable: true})
  @IsEnum(() => SkillSortOrder, {each: true})
  public order_by?: EntityOrderKey<SkillEntity>[];
  
}

const SkillSortOrder = SkillPaginationValidator.toEnumFromFieldList<SkillEntity>(["id", "created_at", "updated_at", "name", "type"]);
registerEnumType(SkillSortOrder, {name: "SkillSortOrder"});
