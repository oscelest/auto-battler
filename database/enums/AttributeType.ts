import {registerEnumType} from "type-graphql";

export enum AttributeType {
  HEALTH       = "health",
  ATTACK_POWER = "attack_power",
  SPELL_POWER  = "spell_power",
}

registerEnumType(AttributeType, {name: "AttributeType"});
