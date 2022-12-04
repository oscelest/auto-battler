import {IsEnum} from "class-validator";
import {Field, InputType} from "type-graphql";
import {OperationEntity} from "../../entities";
import {TargetType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";

@InputType()
export class OperationCreateValidator {
  
  @Field(() => TargetType)
  @IsEnum(TargetType)
  public target!: TargetType;
  
}

@InputType()
export class OperationUpdateValidator {
  
  @Field(() => TargetType, {nullable: true})
  @IsEnum(TargetType)
  public target?: TargetType;
  
}

@InputType()
export class OperationPaginationValidator extends CorePaginationValidator<OperationEntity> {
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<OperationEntity>[];
  
}

const order_by_enum = OperationEntity.registerAsEnum("OperationSortOrder", ["id", "created_at", "updated_at", "target"]);
