import {registerEnumType} from "type-graphql";

export enum EffectExpirationType {
  DURATION = "duration",
  CLEANSE  = "cleanse",
  DISPEL   = "dispel",
  DEATH    = "death",
}

registerEnumType(EffectExpirationType, {name: "EffectExpirationType"});
