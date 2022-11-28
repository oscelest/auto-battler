import {IsEnum, IsString} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {UnitClassEntity} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";

@InputType()
export class UnitClassCreateValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
}

@InputType()
export class UnitClassUpdateValidator {
  
  @Field({nullable: true})
  @IsString()
  public name?: string;
  
}

@InputType()
export class UnitClassPaginationValidator extends CorePaginationValidator<UnitClassEntity> {
  
  @Field(() => [UnitClassSortOrder], {nullable: true})
  @IsEnum(() => UnitClassSortOrder, {each: true})
  public order_by?: EntityOrderKey<UnitClassEntity>[];
  
}

const UnitClassSortOrder = UnitClassPaginationValidator.toEnumFromFieldList<UnitClassEntity>(["id", "created_at", "updated_at", "name"]);
registerEnumType(UnitClassSortOrder, {name: "UnitClassSortOrder"});
