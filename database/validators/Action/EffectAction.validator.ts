import {IsUUID} from "class-validator";
import {Field, InputType} from "type-graphql";
import {ActionCreateValidator, ActionUpdateValidator} from "./Action.validator";

@InputType()
export class EffectActionCreateValidator extends ActionCreateValidator {
  
  @Field()
  @IsUUID()
  public effect!: string;
  
}

@InputType()
export class EffectActionUpdateValidator extends ActionUpdateValidator {
  
  @Field({nullable: true})
  @IsUUID()
  public effect?: string;
  
}
