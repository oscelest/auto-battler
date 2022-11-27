import {IsBoolean, IsEnum, IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ActionEntity} from "../../entities";
import {ActionType} from "../../enums";
import {EntityProps} from "../../Globals";


@InputType({isAbstract: true})
export abstract class ActionCreateValidator implements EntityProps<ActionEntity> {
  
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
export abstract class ActionUpdateValidator implements EntityProps<ActionEntity> {
  
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
