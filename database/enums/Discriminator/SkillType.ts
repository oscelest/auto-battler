import {registerEnumType} from "type-graphql";

export enum SkillType {
  CHARGE = "charge",
  COMBO  = "combo",
}

registerEnumType(SkillType, {name: "SkillType"});
