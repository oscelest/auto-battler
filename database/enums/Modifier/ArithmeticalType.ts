import {registerEnumType} from "type-graphql";

export enum ArithmeticalType {
  ADDITIVE       = "additive",
  MULTIPLICATIVE = "multiplicative",
  EXPONENTIAL    = "exponential",
}

registerEnumType(ArithmeticalType, {name: "ArithmeticalType"});
