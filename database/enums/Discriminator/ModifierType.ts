import {registerEnumType} from "type-graphql";

export enum ModifierType {
  NUMERICAL = "numerical",
  ATTRIBUTE = "attribute",
}

registerEnumType(ModifierType, {name: "ModifierType"});
