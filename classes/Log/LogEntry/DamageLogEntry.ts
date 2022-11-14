import DamageElementType from "../../../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../../../enums/Encounter/Damage/DamageSourceType";
import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Unit} from "../../Unit";
import LogEntry, {LogEntryInitializer} from "./LogEntry";

export default class DamageLogEntry extends LogEntry {
  
  public value: number;
  public count: number;
  public periodic: boolean;
  public target_unit: Unit;
  public source_type: DamageSourceType;
  public element_type: DamageElementType;
  
  public constructor(initializer: DamageLogEntryInitializer) {
    super(LogEntryType.DAMAGE, initializer);
    
    this.value = initializer.value;
    this.count = initializer.count ?? 1;
    this.periodic = initializer.periodic ?? false;
    this.target_unit = initializer.target_unit;
    this.source_type = initializer.damage_source;
    this.element_type = initializer.damage_element;
  }
  
  public getUniqueKey(): string {
    const periodic = this.periodic ? "periodic" : "static";
    return `damage://${this.target_unit.id}/${this.source_type}/${this.element_type}:${periodic}`;
  }
  
  public incrementBy(entry: typeof this): this {
    this.value += entry.value;
    return this;
  }
  
}

export interface DamageLogEntryInitializer extends LogEntryInitializer {
  value: number;
  count?: number;
  periodic?: boolean;
  target_unit: Unit;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
}
