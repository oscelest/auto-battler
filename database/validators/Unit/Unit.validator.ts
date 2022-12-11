import {IsEnum, IsNumber, IsString, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {UnitEntity, UnitPaginationOrder} from "../../entities";
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
  
  @Field(() => [UnitPaginationOrder], {nullable: true})
  @IsEnum(() => UnitPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<UnitEntity>[];
  
}
