import {IsEnum, IsNumber} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ModifierEntity} from "../../entities";
import {ModifierCategoryType} from "../../enums";
import {EntityProps} from "../../Globals";

@InputType({isAbstract: true})
export abstract class ModifierCreateValidator implements EntityProps<ModifierEntity> {
  
  @Field()
  @IsNumber()
  public value!: number;
  
  @Field({nullable: true})
  @IsNumber()
  public value_per_level?: number;
  
  @Field(() => ModifierCategoryType)
  @IsEnum(ModifierCategoryType)
  public category!: ModifierCategoryType;
  
}

@InputType({isAbstract: true})
export abstract class ModifierUpdateValidator implements EntityProps<ModifierEntity> {
  
  @Field({nullable: true})
  @IsNumber()
  public value?: number;
  
  @Field({nullable: true})
  @IsNumber()
  public value_per_level?: number;
  
  @Field(() => ModifierCategoryType, {nullable: true})
  @IsEnum(ModifierCategoryType)
  public category?: ModifierCategoryType;
  
}
