import HumanizeDuration from "humanize-duration";
import ActionType from "../../../enums/ActionType";
import {Effect} from "../../Effect";
import {Unit} from "../../Unit";
import LogInstance, {LogInstanceInitializer} from "./LogInstance";

export default class EffectLogInstance extends LogInstance<StatusEffectActionCollection> {

  constructor(initializer: StatusEffectLogInstanceInitializer = {}) {
    super(ActionType.EFFECT, initializer);
  }

  public toString() {
    return Object.values(this.collection)
      .filter(instance => instance.duration !== 0)
      .map(instance => instance.duration === undefined
                       ? `[${instance.source_unit}] permanently applies [${instance.effect}] to [${instance.target_unit}].`
                       : `[${instance.source_unit}] applies [${instance.effect}] to [${instance.target_unit}] for ${HumanizeDuration(instance.duration)}.`
      )
      .join("\n");
  }

  public override addValue(source_unit: Unit, target_unit: Unit, effect: Effect, duration?: number) {
    const key = EffectLogInstance.getUniqueKey(source_unit, target_unit, effect, duration);
    if (!this.collection[key]) {
      this.collection[key] = {source_unit, target_unit, effect, duration, count: 1};
    }
    else {
      this.collection[key].count++;
    }

    return this;
  }

  public addInstance(instance: EffectLogInstance): this {
    for (let key in instance.collection) {
      const {source_unit, target_unit, effect, duration, count} = instance.collection[key];
      if (!this.collection[key]) {
        this.collection[key] = {source_unit, target_unit, effect, duration, count};
      }
      else {
        this.collection[key].count += count;
      }
    }

    return this;
  }

  public static getUniqueKey(source_unit: Unit, target_unit: Unit, effect: Effect, duration?: number) {
    return `${source_unit.id}.${target_unit.id}[${effect.id}=${duration ?? "permanent"}]`;
  }
}

export interface StatusEffectActionCollection {
  source_unit: Unit;
  target_unit: Unit;
  effect: Effect;
  duration?: number;
  count: number;
}

export interface StatusEffectLogInstanceInitializer extends LogInstanceInitializer<StatusEffectActionCollection> {

}
