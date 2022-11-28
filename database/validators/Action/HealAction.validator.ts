import {IsBoolean} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class HealActionCreateValidator extends ActionCreateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  public reviving?: boolean;
  
}

@InputType()
export class HealActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  public reviving?: boolean;
  
}
