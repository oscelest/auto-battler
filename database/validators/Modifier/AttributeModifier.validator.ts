import {IsEnum} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {AttributeModifierEntity} from "../../entities";
import {AttributeType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {ModifierCreateValidator, ModifierUpdateValidator} from "./Modifier.validator";

@InputType()
export class AttributeModifierCreateValidator extends ModifierCreateValidator {
  
  @Field(() => AttributeType, {nullable: true})
  @IsEnum(AttributeType)
  public attribute!: AttributeType;
  
}

@InputType()
export class AttributeModifierUpdateValidator extends ModifierUpdateValidator {
  
  @Field(() => AttributeType, {nullable: true})
  @IsEnum(AttributeType)
  public attribute?: AttributeType;
  
}

@InputType()
export class AttributeModifierPaginationValidator extends CorePaginationValidator<AttributeModifierEntity> {
  
  @Field(() => [AttributeModifierSortOrder], {nullable: true})
  @IsEnum(() => AttributeModifierSortOrder, {each: true})
  public order_by?: EntityOrderKey<AttributeModifierEntity>[];
  
}

const AttributeModifierSortOrder = AttributeModifierPaginationValidator.toEnumFromFieldList<AttributeModifierEntity>(["id", "created_at", "updated_at", "attribute"]);
registerEnumType(AttributeModifierSortOrder, {name: "AttributeModifierSortOrder"});
