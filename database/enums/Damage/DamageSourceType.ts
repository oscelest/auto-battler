import {registerEnumType} from "type-graphql";

export enum DamageSourceType {
  ATTACK = "attack",
  SPELL  = "spell",
}

registerEnumType(DamageSourceType, {name: "DamageSourceType"});
