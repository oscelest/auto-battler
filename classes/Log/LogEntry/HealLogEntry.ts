import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class HealLogEntry extends LogEntry {
  
  public value: number;
  public count: number;
  public periodic: boolean;
  public reviving: boolean;
  public target_unit: Unit;
  
  public constructor(initializer: HealLogEntryInitializer) {
    super(LogEntryType.HEAL, initializer);
    
    this.value = initializer.value;
    this.count = initializer.count ?? 1;
    this.periodic = initializer.periodic ?? false;
    this.reviving = initializer.reviving ?? false;
    this.target_unit = initializer.target_unit;
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    const reviving = this.reviving ? "reviving" : "non-reviving";
    return `damage://${this.target_unit.id}:${periodic}:${reviving}`;
  }
  
  public incrementBy(entry: typeof this): this {
    this.value += entry.value;
    return this;
  }
  
}

export interface HealLogEntryInitializer extends LogEntryInitializer {
  value: number;
  count?: number;
  periodic?: boolean;
  reviving?: boolean;
  target_unit: Unit;
}
