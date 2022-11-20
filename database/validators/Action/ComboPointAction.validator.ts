import {IsBoolean, IsNumber, IsOptional} from "class-validator";
import {Field, InputType} from "type-graphql";
import ActionValidator from "./Action.validator";

@InputType()
export default class ComboPointActionValidator extends ActionValidator {
  
  @Field()
  @IsNumber()
  public base_value!: number;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public retained?: boolean;
}
