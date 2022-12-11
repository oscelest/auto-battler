import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ArithmeticalModifierEntity, ArithmeticalModifierPaginationOrder} from "../../entities";
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
  
  @Field(() => [ArithmeticalModifierPaginationOrder], {nullable: true})
  @IsEnum(() => ArithmeticalModifierPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<ArithmeticalModifierEntity>[];
  
}
