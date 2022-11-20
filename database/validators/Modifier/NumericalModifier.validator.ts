import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ModifierNumericalType} from "../../enums/Modifier/ModifierNumericalType";
import ModifierValidator from "./Modifier.validator";

@InputType()
export default class NumericalModifierValidator extends ModifierValidator {
  
  @Field(() => ModifierNumericalType)
  @IsEnum(ModifierNumericalType)
  public numerical_type!: ModifierNumericalType;
  
}
