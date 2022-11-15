import LogEntryType from "../../../enums/Encounter/LogEntryType";
import {Source} from "../../Source";

export default abstract class LogEntry {
  
  public type: LogEntryType;
  public count: number;
  public source: Source;
  
  protected constructor(type: LogEntryType, initializer: LogEntryInitializer) {
    this.type = type;
    this.count = initializer.count ?? 1;
    this.source = initializer.source;
  }
  
  public abstract getUniqueKey(): string;
  
  public abstract incrementBy(value: LogEntry): this
  
}

export interface LogEntryInitializer {
  count?: number;
  source: Source;
}
