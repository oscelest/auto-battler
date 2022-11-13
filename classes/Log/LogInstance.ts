import LogEntry from "./LogEntry";

export default class LogInstance {
  
  private readonly log_entry_collection: {[key: string]: LogEntry[]};
  
  constructor(initializer: LogInitializer = {}) {
    this.log_entry_collection = initializer.log_entry_collection ?? {};
  }
  
  public toString() {
    return "";
  }
  
  public write(entry: LogEntry) {
    this.getList(entry.getUniqueKey()).push(entry);
  }
  
  private getList(key: string) {
    return this.log_entry_collection[key] ?? (this.log_entry_collection[key] = []);
  }
  
}

export interface LogInitializer {
  log_lines?: string[];
  log_entry_collection?: {[key: string]: LogEntry[]};
}
