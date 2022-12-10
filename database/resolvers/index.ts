import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {ComboPointActionResolver, DamageActionResolver, EffectActionResolver, HealActionResolver} from "./Action";
import {EffectResolver} from "./Effect";
import {ArithmeticalModifierResolver, AttributeModifierResolver} from "./Modifier";
import {OperationResolver} from "./Operation";
import {SkillResolver} from "./Skill";
import {DamageReceivedTriggerResolver, ExpirationTriggerResolver, HealingReceivedTriggerResolver, PeriodicTriggerResolver} from "./Trigger";
import {UnitResolver, UnitTypeResolver} from "./Unit";

export const resolver_list: NonEmptyArray<Function> = [
  ComboPointActionResolver, DamageActionResolver, EffectActionResolver, HealActionResolver,
  EffectResolver,
  ArithmeticalModifierResolver, AttributeModifierResolver,
  OperationResolver,
  SkillResolver,
  PeriodicTriggerResolver, DamageReceivedTriggerResolver, HealingReceivedTriggerResolver, ExpirationTriggerResolver,
  UnitResolver, UnitTypeResolver
];
