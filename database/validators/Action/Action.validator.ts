import {IsBoolean, IsEnum, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ActionType} from "../../enums";


@InputType({isAbstract: true})
export abstract class ActionCreateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public periodic?: boolean;
  
  @Field(() => ActionType)
  @IsEnum(ActionType)
  public type!: ActionType;
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}

@InputType({isAbstract: true})
export abstract class ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsBoolean()
  public periodic?: boolean;
  
  @Field(() => ActionType, {nullable: true})
  @IsEnum(ActionType)
  public type?: ActionType;
  
  @Field(() => [String], {nullable: true})
  @IsUUID("4", {each: true})
  public modifier_list?: string[];
  
}
