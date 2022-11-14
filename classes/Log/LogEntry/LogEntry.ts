import LogEntryType from "../../../enums/Encounter/LogEntryType";

export default abstract class LogEntry {
  
  public type: LogEntryType;
  
  protected constructor(type: LogEntryType, initializer: LogEntryInitializer) {
    this.type = type;
  }
  
  public abstract getUniqueKey(): string;
  
  public abstract incrementBy(value: typeof this): this
  
}

export interface LogEntryInitializer {

}
