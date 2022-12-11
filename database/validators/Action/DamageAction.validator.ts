import {IsBoolean, IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {DamageActionEntity, DamageActionPaginationOrder} from "../../entities";
import {DamageElementType, DamageSourceType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class DamageActionCreateValidator extends ActionCreateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field(() => DamageSourceType)
  @IsEnum(DamageSourceType)
  public damage_source!: DamageSourceType;
  
  @Field(() => DamageElementType)
  @IsEnum(DamageElementType)
  public damage_element!: DamageElementType;
  
}

@InputType()
export class DamageActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public direct?: boolean;
  
  @Field(() => DamageSourceType, {nullable: true})
  @IsEnum(DamageSourceType)
  public damage_source!: DamageSourceType;
  
  @Field(() => DamageElementType, {nullable: true})
  @IsEnum(DamageElementType)
  public damage_element!: DamageElementType;
  
}

@InputType()
export class DamageActionPaginationValidator extends CorePaginationValidator<DamageActionEntity> {
  
  @Field(() => [DamageActionPaginationOrder], {nullable: true})
  @IsEnum(() => DamageActionPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<DamageActionEntity>[];
  
}
