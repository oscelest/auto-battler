import {IsBoolean, IsOptional} from "class-validator";
import {Field, InputType} from "type-graphql";
import ActionValidator from "./Action.validator";

@InputType()
export default class HealActionValidator extends ActionValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public reviving?: boolean;
  
}
