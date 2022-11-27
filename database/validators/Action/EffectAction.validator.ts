import {IsEnum, IsUUID} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {EffectActionEntity} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class EffectActionCreateValidator extends ActionCreateValidator {
  
  @Field()
  @IsUUID()
  public effect!: string;
  
}

@InputType()
export class EffectActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsUUID()
  public effect?: string;
  
}

@InputType()
export class HealActionPaginationValidator extends CorePaginationValidator<EffectActionEntity> {
  
  @Field(() => [EffectActionSortOrder], {nullable: true})
  @IsEnum(() => EffectActionSortOrder, {each: true})
  public order_by?: EntityOrderKey<EffectActionEntity>[];
  
}

const EffectActionSortOrder = HealActionPaginationValidator.toEnumFromFieldList<EffectActionEntity>(["id", "created_at", "updated_at", "effect.id"]);
registerEnumType(EffectActionSortOrder, {name: "EffectActionSortOrder"});
