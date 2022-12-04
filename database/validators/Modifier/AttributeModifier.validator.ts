import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
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
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<AttributeModifierEntity>[];
  
}

const order_by_enum = AttributeModifierEntity.registerAsEnum("AttributeModifierSortOrder", ["id", "created_at", "updated_at", "attribute"]);
