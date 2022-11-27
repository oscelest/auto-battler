import {registerEnumType} from "type-graphql";

export enum ModifierType {
  ARITHMETICAL = "arithmetical",
  ATTRIBUTE    = "attribute",
}

registerEnumType(ModifierType, {name: "ModifierType"});
