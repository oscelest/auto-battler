import {IsBoolean, IsEnum, IsOptional, IsString} from "class-validator";
import {Field, InputType} from "type-graphql";
import {EffectEntity, EffectPaginationOrder} from "../../entities";
import {EffectAlignmentType} from "../../enums";
import {EntityOrderKey} from "../../Globals";
import {CorePaginationValidator} from "../Core.validator";

@InputType()
export class EffectCreateValidator {
  
  @Field()
  @IsString()
  public name!: string;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public expires?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public removable?: boolean;
  
  @Field(() => EffectAlignmentType)
  @IsEnum(EffectAlignmentType)
  public alignment!: EffectAlignmentType;
  
}

@InputType()
export class EffectUpdateValidator {
  
  @Field({nullable: true})
  @IsString()
  public name?: string;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public expires?: boolean;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public removable?: boolean;
  
  @Field(() => EffectAlignmentType, {nullable: true})
  @IsEnum(EffectAlignmentType)
  public alignment?: EffectAlignmentType;
  
}


@InputType()
export class EffectPaginationValidator extends CorePaginationValidator<EffectEntity> {
  
  @Field(() => [EffectPaginationOrder], {nullable: true})
  @IsEnum(() => EffectPaginationOrder, {each: true})
  public order_by?: EntityOrderKey<EffectEntity>[];
  
}
