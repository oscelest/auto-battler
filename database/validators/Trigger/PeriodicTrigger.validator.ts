import {IsNumber} from "class-validator";
import {Field, InputType} from "type-graphql";
import TriggerValidator from "./Trigger.validator";

@InputType()
export default class DamageReceivedTriggerValidator extends TriggerValidator {
  
  @Field()
  @IsNumber()
  public interval!: number;
  
}
