import {IsEnum, IsString} from "class-validator";
import {Field, InputType} from "type-graphql";
import {SkillType} from "../../enums";

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

