import {IsEnum, IsNumber, IsOptional} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ModifierCategoryType} from "../../enums/Modifier/ModifierCategoryType";
import {ModifierType} from "../../enums/Modifier/ModifierType";

@InputType({isAbstract: true})
export default abstract class ModifierValidator {
  
  @Field(() => ModifierType)
  @IsEnum(ModifierType)
  public type!: ModifierType;
  
  @Field()
  @IsNumber()
  public value!: number;
  
  @Field({nullable: true})
  @IsNumber()
  @IsOptional()
  public value_per_level?: number;
  
  @Field(() => ModifierCategoryType)
  @IsEnum(ModifierCategoryType)
  public category!: ModifierCategoryType;
  
}