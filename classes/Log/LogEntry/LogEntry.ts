import LogEntryType from "../../../enums/Encounter/LogEntryType";

export default abstract class LogEntry {
  
  public type: LogEntryType;
  public count: number;
  
  protected constructor(type: LogEntryType, initializer: LogEntryInitializer) {
    this.type = type;
    this.count = initializer.count ?? 1;
  }
  
  public abstract getUniqueKey(): string;
  
  public abstract incrementBy(value: typeof this): this
  
}

export interface LogEntryInitializer {
  count?: number;
}
