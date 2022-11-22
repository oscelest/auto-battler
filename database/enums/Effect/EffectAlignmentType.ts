import {registerEnumType} from "type-graphql";

export enum EffectAlignmentType {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL  = "neutral",
}

registerEnumType(EffectAlignmentType, {name: "EffectAlignmentType"});
