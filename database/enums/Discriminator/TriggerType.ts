import {registerEnumType} from "type-graphql";

export enum TriggerType {
  PERIODIC         = "periodic",
  EXPIRATION       = "expiration",
  DAMAGE_RECEIVED  = "damage_received",
  HEALING_RECEIVED = "healing_received",
}

registerEnumType(TriggerType, {name: "TriggerType"});
