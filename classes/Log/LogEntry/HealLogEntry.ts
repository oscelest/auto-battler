import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class HealLogEntry extends LogEntry {
  
  public periodic: boolean;
  public reviving: boolean;
  public target_unit: Unit;
  public received_value: number;
  
  public constructor(initializer: HealLogEntryInitializer) {
    super(LogEntryType.HEAL, initializer);
    
    this.periodic = initializer.periodic ?? false;
    this.reviving = initializer.reviving ?? false;
    this.target_unit = initializer.target_unit;
    this.received_value = initializer.received_value;
  }
  
  public toString() {
    const {source, received_value, target_unit} = this;
    const periodic = this.getPeriodicString();
    const reviving = this.getRevivingString();
    
    return `${source} healed ${received_value} points of health for ${target_unit} ${reviving} ${periodic}.`.replace(/\s{2}/g, "");
  }
  
  private getPeriodicString() {
    return this.periodic ? "over the duration" : this.getCountString();
  }
  
  private getCountString() {
    return this.count > 1 ? `(${this.count}x chain)` : " ";
  }
  
  private getRevivingString() {
    return this.reviving ? "(revived)" : " ";
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    const reviving = this.reviving ? "reviving" : "non-reviving";
    return `heal://${this.target_unit.id}:${periodic}:${reviving}`;
  }
  
  public incrementBy(entry: HealLogEntry): this {
    this.received_value += entry.received_value;
    return this;
  }
  
}

export interface HealLogEntryInitializer extends LogEntryInitializer {
  periodic?: boolean;
  reviving?: boolean;
  target_unit: Unit;
  received_value: number;
}
