import {IsBoolean, IsEnum, IsOptional} from "class-validator";
import {Field, InputType} from "type-graphql";
import {DamageElementType, DamageSourceType} from "../../enums";
import ActionValidator from "./Action.validator";

@InputType()
export default class DamageActionValidator extends ActionValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public direct?: boolean;
  
  @Field(() => DamageSourceType)
  @IsEnum(DamageSourceType)
  public damage_source!: DamageSourceType;
  
  @Field(() => DamageElementType)
  @IsEnum(DamageElementType)
  public damage_element!: DamageElementType;
  
}
