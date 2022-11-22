import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {UnitAttributeType} from "../../enums";
import ModifierValidator from "./Modifier.validator";

@InputType()
export default class AttributeModifierValidator extends ModifierValidator {
  
  @Field(() => UnitAttributeType)
  @IsEnum(UnitAttributeType)
  public attribute!: UnitAttributeType;
  
}
