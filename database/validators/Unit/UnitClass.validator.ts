import {IsString} from "class-validator";
import {Field, InputType} from "type-graphql";

@InputType()
export default class UnitClassValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
}
