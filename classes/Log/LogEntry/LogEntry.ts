import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Source} from "../../Source";
import {ComboPointLogEntryInitializer} from "./ComboPointLogEntry";
import {DamageLogEntryInitializer} from "./DamageLogEntry";
import {EffectLogEntryInitializer} from "./EffectLogEntry";
import {HealLogEntryInitializer} from "./HealLogEntry";
import {ComboPointLogEntry, DamageLogEntry, EffectLogEntry, HealLogEntry} from "./index";

export default abstract class LogEntry {
  
  public type: LogEntryType;
  public count: number;
  public source: Source;
  public periodic: boolean;
  
  protected constructor(type: LogEntryType, initializer: LogEntryInitializer) {
    this.type = type;
    this.count = initializer.count ?? 1;
    this.source = initializer.source;
    this.periodic = initializer.periodic ?? false;
  }
  
  public static instantiate(type: LogEntryType, initializer: LogEntryInitializer) {
    switch (type) {
      case LogEntryType.COMBO_POINT:
        return new ComboPointLogEntry(initializer as ComboPointLogEntryInitializer);
      case LogEntryType.DAMAGE:
        return new DamageLogEntry(initializer as DamageLogEntryInitializer);
      case LogEntryType.EFFECT:
        return new EffectLogEntry(initializer as EffectLogEntryInitializer);
      case LogEntryType.HEAL:
        return new HealLogEntry(initializer as HealLogEntryInitializer);
    }
    throw new Error(`Could not initialize LogEntry with type ${type}.`);
  }
  
  public static instantiateEmpty(type: LogEntryType, initializer: LogEntryInitializer) {
    switch (type) {
      case LogEntryType.COMBO_POINT:
        return new ComboPointLogEntry({...initializer as ComboPointLogEntryInitializer, count: 0, received_value: 0});
      case LogEntryType.DAMAGE:
        return new DamageLogEntry({...initializer as DamageLogEntryInitializer, count: 0, received_value: 0});
      case LogEntryType.EFFECT:
        return new EffectLogEntry({...initializer as EffectLogEntryInitializer, count: 0});
      case LogEntryType.HEAL:
        return new HealLogEntry({...initializer as HealLogEntryInitializer, count: 0, received_value: 0});
    }
    throw new Error(`Could not initialize LogEntry with type ${type}.`);
  }
  
  public abstract getUniqueKey(): string;
  
  public abstract incrementBy(value: LogEntry): this
  
}

export interface LogEntryInitializer {
  count?: number;
  source: Source;
  periodic?: boolean;
}
