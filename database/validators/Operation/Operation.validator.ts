import {IsEnum, IsOptional, IsString} from "class-validator";
import {Field, InputType} from "type-graphql";
import {TargetType} from "../../enums";

@InputType()
export default class OperationValidator {
  
  @Field({nullable: true})
  @IsString()
  @IsOptional()
  public description?: string;
  
  @Field(() => TargetType)
  @IsEnum(TargetType)
  public target!: TargetType;
  
}
