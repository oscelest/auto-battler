import {IsEnum, IsString} from "class-validator";
import {Field, InputType} from "type-graphql";
import {SkillType} from "../../enums/Discriminator/SkillType";

@InputType()
export default class SkillValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field(() => SkillType)
  @IsEnum(SkillType)
  public type!: SkillType;
  
}
