import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {UnitAttributeType} from "../../enums";
import {ModifierCreateValidator, ModifierUpdateValidator} from "./Modifier.validator";

@InputType()
export class AttributeModifierCreateValidator extends ModifierCreateValidator {
  
  @Field(() => UnitAttributeType, {nullable: true})
  @IsEnum(UnitAttributeType)
  public attribute!: UnitAttributeType;
  
}

@InputType()
export class AttributeModifierUpdateValidator extends ModifierUpdateValidator {
  
  @Field(() => UnitAttributeType, {nullable: true})
  @IsEnum(UnitAttributeType)
  public attribute?: UnitAttributeType;
  
}
