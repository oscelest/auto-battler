import {IsNumber, IsOptional, IsString} from "class-validator";
import {Field, InputType} from "type-graphql";

@InputType()
export default class UnitValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field()
  @IsNumber()
  @IsOptional()
  public experience?: number;
  
  @Field()
  @IsString()
  public unit_class!: string;
  
}
