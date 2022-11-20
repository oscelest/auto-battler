import {LogEntryType} from "../../../enums";
import {Skill} from "../../Skill";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class ComboPointLogEntry extends LogEntry {
  
  public retained: boolean;
  public target_skill: Skill;
  public received_value: number;
  
  public constructor(initializer: ComboPointLogEntryInitializer) {
    super(LogEntryType.COMBO_POINT, initializer);
    
    this.retained = initializer.retained ?? false;
    this.target_skill = initializer.target_skill;
    this.received_value = initializer.received_value ?? 0;
  }
  
  public toString() {
    const name = this.target_skill.toString();
    const value = this.received_value;
    const periodic = this.getPeriodicString();
    
    if (this.retained) {
      return `${name} retained ${value} combo points`;
    }
    return `${name} gained ${value} combo points from ${this.source} ${periodic}.`.replace(/\s{2,}/g, "");
  }
  
  private getPeriodicString() {
    return this.periodic ? "over the duration" : this.getCountString();
  }
  
  private getCountString() {
    return this.count > 1 ? `(${this.count}x chain)` : " ";
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    const retained = this.retained ? "retained" : "non-retained";
    return `combo-point://${this.target_skill.id}:${periodic}:${retained}`;
  }
  
  public incrementBy(entry: ComboPointLogEntry): this {
    this.received_value += entry.received_value;
    return this;
  }
  
  
}

export interface ComboPointLogEntryInitializer extends LogEntryInitializer {
  retained?: boolean;
  target_skill: Skill;
  received_value?: number;
}
