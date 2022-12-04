import {IsEnum, IsNumber, IsString, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
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
  public type!: string;
  
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
  public type?: string;
  
}

@InputType()
export class UnitPaginationValidator extends CorePaginationValidator<UnitEntity> {
  
  @Field(() => [order_by_enum], {nullable: true})
  @IsEnum(() => order_by_enum, {each: true})
  public order_by?: EntityOrderKey<UnitEntity>[];
  
}

const order_by_enum = UnitEntity.registerAsEnum("UnitSortOrder", ["id", "created_at", "updated_at", "name", "experience", "type.id"]);
