import {registerEnumType} from "type-graphql";

export enum UnitAttributeType {
  HEALTH       = "health",
  ATTACK_POWER = "attack_power",
  SPELL_POWER  = "spell_power",
}

registerEnumType(UnitAttributeType, {name: "UnitAttributeType"});
