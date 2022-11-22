import {registerEnumType} from "type-graphql";

export enum ActionType {
  DAMAGE      = "damage",
  HEAL        = "heal",
  COMBO_POINT = "combo_point",
  EFFECT      = "effect"
}

registerEnumType(ActionType, {name: "ActionType"});
