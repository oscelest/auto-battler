import {registerEnumType} from "type-graphql";

export enum ModifierNumericalType {
  FLAT           = "flat",
  ADDITIVE       = "additive",
  MULTIPLICATIVE = "multiplicative",
}

registerEnumType(ModifierNumericalType, {name: "ModifierNumericalType"});
