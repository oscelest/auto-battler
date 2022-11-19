import DamageElementType from "../../../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../../../enums/Encounter/Damage/DamageSourceType";
import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class DamageLogEntry extends LogEntry {
  
  public target_unit: Unit;
  public damage_source: DamageSourceType;
  public damage_element: DamageElementType;
  public received_value: number;
  
  public constructor(initializer: DamageLogEntryInitializer) {
    super(LogEntryType.DAMAGE, initializer);
    
    this.target_unit = initializer.target_unit;
    this.damage_source = initializer.damage_source;
    this.damage_element = initializer.damage_element;
    this.received_value = initializer.received_value;
  }
  
  public toString() {
    const {source, damage_source, damage_element, received_value, target_unit} = this;
    const value = Math.round(received_value);
    const periodic = this.getPeriodicString();
  
    return `${source} dealt ${value} ${damage_element} ${damage_source} damage to ${target_unit} ${periodic}.`.replace(/\s{2,}/g, "");
  }
  
  private getPeriodicString() {
    return this.periodic ? "over the duration" : this.getCountString();
  }
  
  private getCountString() {
    return this.count > 1 ? `(${this.count}x chain)` : " ";
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "non-periodic";
    return `damage://${this.target_unit.id}/${this.damage_source}/${this.damage_element}:${periodic}`;
  }
  
  public incrementBy(entry: DamageLogEntry): this {
    this.received_value += entry.received_value;
    return this;
  }
}

export interface DamageLogEntryInitializer extends LogEntryInitializer {
  target_unit: Unit;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
  received_value: number;
}
