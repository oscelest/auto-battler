import {IsBoolean, IsNumber} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class ComboPointActionCreateValidator extends ActionCreateValidator {
  
  @Field()
  @IsNumber()
  public base_value!: number;
  
  @Field({nullable: true})
  @IsBoolean()
  public retained?: boolean;
  
}

@InputType()
export class ComboPointActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsNumber()
  public base_value?: number;
  
  @Field({nullable: true})
  @IsBoolean()
  public retained?: boolean;
  
}
