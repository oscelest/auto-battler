import HumanizeDuration from "humanize-duration";
import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Effect} from "../../Effect";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class EffectLogEntry extends LogEntry {
  
  public effect: Effect;
  public periodic: boolean;
  public target_unit: Unit;
  
  public constructor(initializer: EffectHealLogEntryInitializer) {
    super(LogEntryType.EFFECT, initializer);
    
    this.effect = initializer.effect;
    this.periodic = initializer.periodic ?? false;
    this.target_unit = initializer.target_unit;
  }
  
  public toString() {
    const {source, effect, target_unit} = this;
    const periodic = this.getPeriodicString();
    
    return `${source} applied ${effect} to ${target_unit} lasting ${HumanizeDuration(effect.duration)} ${periodic}.`.replace(/\s{2,}/g, "");
  }
  
  private getPeriodicString() {
    return this.periodic ? "over the duration" : this.getCountString();
  }
  
  private getCountString() {
    return this.count > 1 ? `(${this.count}x chain)` : " ";
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    return `effect://${this.target_unit.id}/${this.effect.id}/${this.effect.duration}:${periodic}`;
  }
  
  public incrementBy(entry: EffectLogEntry): this {
    this.count += entry.count;
    return this;
  }
  
}

export interface EffectHealLogEntryInitializer extends LogEntryInitializer {
  effect: Effect;
  periodic?: boolean;
  target_unit: Unit;
}
