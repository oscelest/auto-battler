import ActionType from "../../../enums/ActionType";
import {Unit} from "../../Unit";
import LogInstance, {LogInstanceInitializer} from "./LogInstance";

export default class HealLogInstance extends LogInstance<HealActionCollection> {

  constructor(initializer: HealLogInstanceInitializer = {}) {
    super(ActionType.HEAL, initializer);
  }

  public toString() {
    return Object.values(this.collection)
      .filter(instance => instance.value !== 0)
      .map(instance => `[${instance.source_unit}] heals [${instance.target_unit}] for ${instance.value} health.`)
      .join("\n");
  }

  public override addValue(source_unit: Unit, target_unit: Unit, value: number) {
    const key = HealLogInstance.getUniqueKey(source_unit, target_unit);
    if (!this.collection[key]) {
      this.collection[key] = {source_unit, target_unit, value, count: 1};
    }
    else {
      this.collection[key].value += value;
      this.collection[key].count++;
    }

    return this;
  }

  public addInstance(instance: HealLogInstance): this {
    for (let key in instance.collection) {
      const {source_unit, target_unit, value, count} = instance.collection[key];
      if (!this.collection[key]) {
        this.collection[key] = {source_unit, target_unit, value, count};
      }
      else {
        this.collection[key].value += value;
        this.collection[key].count += count;
      }
    }

    return this;
  }

  public static getUniqueKey(source_unit: Unit, target_unit: Unit) {
    return `${source_unit.id}.${target_unit.id}`;
  }

}

export interface HealActionCollection {
  value: number;
  source_unit: Unit;
  target_unit: Unit;
  count: number;
}

export interface HealLogInstanceInitializer extends LogInstanceInitializer<HealActionCollection> {

}
