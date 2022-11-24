import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ModifierNumericalType} from "../../enums";
import {ModifierCreateValidator, ModifierUpdateValidator} from "./Modifier.validator";

@InputType()
export class NumericalModifierCreateValidator extends ModifierCreateValidator {
  
  @Field(() => ModifierNumericalType)
  @IsEnum(ModifierNumericalType)
  public numerical_type!: ModifierNumericalType;
  
}

@InputType()
export class NumericalModifierUpdateValidator extends ModifierUpdateValidator {
  
  @Field(() => ModifierNumericalType)
  @IsEnum(ModifierNumericalType)
  public numerical_type!: ModifierNumericalType;
  
}

