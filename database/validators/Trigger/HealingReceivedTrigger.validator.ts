import {InputType} from "type-graphql";
import {TriggerCreateValidator, TriggerUpdateValidator} from "./Trigger.validator";


@InputType()
export class HealingReceivedTriggerCreateValidator extends TriggerCreateValidator {
  
}

@InputType()
export class HealingReceivedTriggerUpdateValidator extends TriggerUpdateValidator {

}
