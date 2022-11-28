import {IsEnum} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
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
  
  @Field(() => [OperationSortOrder], {nullable: true})
  @IsEnum(() => OperationSortOrder, {each: true})
  public order_by?: EntityOrderKey<OperationEntity>[];
  
}

const OperationSortOrder = OperationPaginationValidator.toEnumFromFieldList<OperationEntity>(["id", "created_at", "updated_at", "target"]);
registerEnumType(OperationSortOrder, {name: "OperationSortOrder"});
