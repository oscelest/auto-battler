import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class ComboPointLogEntry extends LogEntry {
  
  public value: number;
  public retained: boolean;
  public periodic: boolean;
  public target_unit: Unit;
  
  public constructor(initializer: ComboPointLogEntryInitializer) {
    super(LogEntryType.DAMAGE, initializer);
    
    this.value = initializer.value;
    this.periodic = initializer.periodic ?? false;
    this.retained = initializer.retained ?? false;
    this.target_unit = initializer.target_unit;
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    const retained = this.retained ? "retained" : "non-retained";
    return `combo-point://${this.target_unit.id}:${periodic}:${retained}`;
  }
  
  public incrementBy(entry: ComboPointLogEntry): this {
    this.value += entry.value;
    return this;
  }
  
}

export interface ComboPointLogEntryInitializer extends LogEntryInitializer {
  value: number;
  periodic?: boolean;
  retained?: boolean;
  target_unit: Unit;
}
