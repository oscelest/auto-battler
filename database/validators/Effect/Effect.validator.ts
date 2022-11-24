import {IsBoolean, IsEnum, IsOptional, IsString} from "class-validator";
import {Field, InputType} from "type-graphql";
import {EffectAlignmentType} from "../../enums";

@InputType()
export default class EffectValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public expires?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public removable?: boolean;
  
  @Field(() => EffectAlignmentType)
  @IsEnum(EffectAlignmentType)
  public alignment!: EffectAlignmentType;
  
}
