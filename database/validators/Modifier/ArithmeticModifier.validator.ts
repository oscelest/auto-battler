import {IsEnum} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {ArithmeticalModifierEntity} from "../../entities/Modifier/ArithmeticalModifierEntity";
import {ArithmeticalType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {ModifierCreateValidator, ModifierUpdateValidator} from "./Modifier.validator";

@InputType()
export class ArithmeticalModifierCreateValidator extends ModifierCreateValidator {
  
  @Field(() => ArithmeticalType)
  @IsEnum(ArithmeticalType)
  public arithmetical!: ArithmeticalType;
  
}

@InputType()
export class ArithmeticalModifierUpdateValidator extends ModifierUpdateValidator {
  
  @Field(() => ArithmeticalType)
  @IsEnum(ArithmeticalType)
  public arithmetical!: ArithmeticalType;
  
}

@InputType()
export class ArithmeticalModifierPaginationValidator extends CorePaginationValidator<ArithmeticalModifierEntity> {
  
  @Field(() => [ArithmeticalModifierSortOrder], {nullable: true})
  @IsEnum(() => ArithmeticalModifierSortOrder, {each: true})
  public order_by?: EntityOrderKey<ArithmeticalModifierEntity>[];
  
}

const ArithmeticalModifierSortOrder = ArithmeticalModifierPaginationValidator.toEnumFromFieldList<ArithmeticalModifierEntity>(["id", "created_at", "updated_at", "arithmetical"]);
registerEnumType(ArithmeticalModifierSortOrder, {name: "ArithmeticalModifierSortOrder"});
