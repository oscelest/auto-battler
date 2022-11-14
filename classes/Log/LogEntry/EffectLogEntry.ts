import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Effect} from "../../Effect";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class EffectLogEntry extends LogEntry {
  
  public count: number;
  public effect: Effect;
  public periodic: boolean;
  public target_unit: Unit;
  
  public constructor(initializer: EffectHealLogEntryInitializer) {
    super(LogEntryType.EFFECT, initializer);
    
    this.count = initializer.count ?? 1;
    this.effect = initializer.effect;
    this.periodic = initializer.periodic ?? false;
    this.target_unit = initializer.target_unit;
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    return `effect://${this.target_unit.id}/${this.effect.id}/${this.effect.duration}:${periodic}`;
  }
  
  public incrementBy(entry: typeof this): this {
    this.count += entry.count;
    return this;
  }
  
}

export interface EffectHealLogEntryInitializer extends LogEntryInitializer {
  count?: number;
  effect: Effect;
  periodic?: boolean;
  target_unit: Unit;
}
