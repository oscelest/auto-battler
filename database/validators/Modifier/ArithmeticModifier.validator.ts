import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ArithmeticalModifierEntity} from "../../entities";
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
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<ArithmeticalModifierEntity>[];
  
}

const order_by_enum = ArithmeticalModifierEntity.registerAsEnum("ArithmeticalModifierSortOrder", ["id", "created_at", "updated_at", "arithmetical"]);
