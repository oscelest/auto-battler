import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {HealActionResolver} from "./Action/HealAction.resolver";
import {AttributeModifierResolver} from "./Modifier";
import {SkillResolver} from "./Skill";
import {UnitResolver} from "./Unit";

export * from "./Unit";
export * from "./Modifier";

export const resolver_list: NonEmptyArray<Function> = [
  HealActionResolver,
  AttributeModifierResolver,
  SkillResolver,
  UnitResolver
];
