import ActionType from "../../../enums/ActionType";
import DamageElementType from "../../../enums/Damage/DamageElementType";
import DamageSourceType from "../../../enums/Damage/DamageSourceType";
import Source from "../../Source";
import {Unit} from "../../Unit";
import LogInstance, {LogInstanceInitializer} from "./LogInstance";

export default class DamageLogInstance extends LogInstance<DamageActionCollection> {

  constructor(initializer: DamageLogInstanceInitializer = {}) {
    super(ActionType.DAMAGE, initializer);
  }

  public toString() {
    return Object.values(this.collection)
      .filter(instance => instance.value !== 0)
      .map(instance => `[${instance.source}] hits [${instance.target_unit}] for ${instance.value} ${instance.element_type} ${instance.source_type} damage.`)
      .join("\n");
  }

  public override addValue(source: Source, target_unit: Unit, source_type: DamageSourceType, element_type: DamageElementType, value: number) {
    const key = DamageLogInstance.getUniqueKey(source, target_unit, source_type, element_type);
    if (!this.collection[key]) {
      this.collection[key] = {source, target_unit, source_type, element_type, value, count: 1};
    }
    else {
      this.collection[key].value += value;
      this.collection[key].count++;
    }

    return this;
  }

  public addInstance(instance: DamageLogInstance): this {
    for (let key in instance.collection) {
      const {source, target_unit, source_type, element_type, value, count} = instance.collection[key];
      if (!this.collection[key]) {
        this.collection[key] = {source, target_unit, source_type, element_type, value, count};
      }
      else {
        this.collection[key].value += value;
        this.collection[key].count += count;
      }
    }

    return this;
  }

  public static getUniqueKey(source: Source, target_unit: Unit, source_type: DamageSourceType, element_type: DamageElementType) {
    return `${source.type}-${target_unit.id}[${source_type}+${element_type}]`;
  }

}

export interface DamageActionCollection {
  value: number;
  source: Source;
  target_unit: Unit;
  source_type: DamageSourceType;
  element_type: DamageElementType;
  count: number;
}

export interface DamageLogInstanceInitializer extends LogInstanceInitializer<DamageActionCollection> {

}
