import {registerEnumType} from "type-graphql";

export enum DamageElementType {
  PHYSICAL = "physical",
  FIRE     = "fire",
  COLD     = "cold",
  LIGHTING = "lightning",
}

registerEnumType(DamageElementType, {name: "DamageElementType"});
