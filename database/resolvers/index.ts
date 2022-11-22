import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {SkillResolver} from "./Skill";
import {UnitResolver} from "./Unit";

export * from "./Unit";
export * from "./Modifier";

export const resolver_list: NonEmptyArray<Function> = [
  // AttributeModifierResolver,
  SkillResolver,
  UnitResolver
];
