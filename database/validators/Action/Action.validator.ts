import {IsBoolean, IsEnum, IsOptional} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ActionType} from "../../enums";

@InputType({isAbstract: true})
export default abstract class ActionValidator {
  
  @Field(() => ActionType)
  @IsEnum(ActionType)
  public type!: ActionType;
  
  @Field({nullable: true})
  @IsBoolean()
  @IsOptional()
  public periodic?: boolean;
  
}
