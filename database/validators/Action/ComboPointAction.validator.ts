import {IsBoolean, IsEnum, IsNumber} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ComboPointActionEntity} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class ComboPointActionCreateValidator extends ActionCreateValidator {
  
  @Field()
  @IsNumber()
  public base_value!: number;
  
  @Field({nullable: true})
  @IsBoolean()
  public retained?: boolean;
  
}

@InputType()
export class ComboPointActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsNumber()
  public base_value?: number;
  
  @Field({nullable: true})
  @IsBoolean()
  public retained?: boolean;
  
}

@InputType()
export class ComboPointActionPaginationValidator extends CorePaginationValidator<ComboPointActionEntity> {
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<ComboPointActionEntity>[];
  
}

const order_by_enum = ComboPointActionEntity.registerAsEnum("ComboPointActionSortOrder", ["id", "created_at", "updated_at", "base_value"]);
