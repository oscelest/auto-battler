import {IsEnum, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {EffectActionEntity, EffectActionPaginationOrder} from "../../entities";
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
export class EffectActionPaginationValidator extends CorePaginationValidator<EffectActionEntity> {
  
  @Field(() => [EffectActionPaginationOrder], {nullable: true})
  @IsEnum(() => EffectActionPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<EffectActionEntity>[];
  
}

