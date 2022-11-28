import {IsEnum, IsNumber, IsString, IsUUID} from "class-validator";
import {Field, InputType, registerEnumType} from "type-graphql";
import {UnitEntity} from "../../entities";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";

@InputType()
export class UnitCreateValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field({nullable: true})
  @IsNumber()
  public experience?: number;
  
  @Field()
  @IsUUID("4")
  public class!: string;
  
}

@InputType()
export class UnitUpdateValidator {
  
  @Field({nullable: true})
  @IsString()
  public name?: string;
  
  @Field({nullable: true})
  @IsNumber()
  public experience?: number;
  
  @Field({nullable: true})
  @IsUUID("4")
  public class?: string;
  
}

@InputType()
export class UnitPaginationValidator extends CorePaginationValidator<UnitEntity> {
  
  @Field(() => [UnitSortOrder], {nullable: true})
  @IsEnum(() => UnitSortOrder, {each: true})
  public order_by?: EntityOrderKey<UnitEntity>[];
  
}

const UnitSortOrder = UnitPaginationValidator.toEnumFromFieldList<UnitEntity>(["id", "created_at", "updated_at", "name", "experience", "class.id"]);
registerEnumType(UnitSortOrder, {name: "UnitSortOrder"});
