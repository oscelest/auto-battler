import {InputType} from "type-graphql";
import {TriggerCreateValidator, TriggerUpdateValidator} from "./Trigger.validator";

@InputType()
export class DamageReceivedTriggerCreateValidator extends TriggerCreateValidator {
  
}

@InputType()
export class DamageReceivedTriggerUpdateValidator extends TriggerUpdateValidator {

}
