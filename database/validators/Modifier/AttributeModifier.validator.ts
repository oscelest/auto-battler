import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {AttributeModifierEntity, AttributeModifierPaginationOrder} from "../../entities";
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
  
  @Field(() => [AttributeModifierPaginationOrder], {nullable: true})
  @IsEnum(() => AttributeModifierPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<AttributeModifierEntity>[];
  
}
