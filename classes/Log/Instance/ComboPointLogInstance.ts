import ActionType from "../../../enums/ActionType";
import {Skill} from "../../Skill";
import {Unit} from "../../Unit";
import LogInstance, {LogInstanceInitializer} from "./LogInstance";

export default class ComboPointLogInstance extends LogInstance<ComboPointActionCollection> {

  constructor(initializer: ComboPointLogInstanceInitializer = {}) {
    super(ActionType.COMBO_POINT, initializer);
  }

  public toString() {
    return Object.values(this.collection)
      .filter(instance => instance.value !== 0)
      .map(instance => `[${instance.source_unit}] adds ${instance.value} combo points to [${instance.target_unit}].`)
      .join("\n");
  }

  public override addValue(skill: Skill, source_unit: Unit, target_unit: Unit, value: number) {
    const key = ComboPointLogInstance.getUniqueKey(skill, source_unit, target_unit);
    if (!this.collection[key]) {
      this.collection[key] = {skill, source_unit, target_unit, value, count: 1};
    }
    else {
      this.collection[key].value += value;
      this.collection[key].count++;
    }

    return this;
  }

  public addInstance(instance: ComboPointLogInstance): this {
    for (let key in instance.collection) {
      const {skill, source_unit, target_unit, value, count} = instance.collection[key];
      if (!this.collection[key]) {
        this.collection[key] = {skill, source_unit, target_unit, value, count};
      }
      else {
        this.collection[key].value += value;
        this.collection[key].count += count;
      }
    }

    return this;
  }

  public static getUniqueKey(skill: Skill, source_unit: Unit, target_unit: Unit) {
    return `${source_unit.id}.${target_unit.id}[${skill}]`;
  }

}

export interface ComboPointActionCollection {
  value: number;
  skill: Skill;
  source_unit: Unit;
  target_unit: Unit;
  count: number;
}

export interface ComboPointLogInstanceInitializer extends LogInstanceInitializer<ComboPointActionCollection> {

}
