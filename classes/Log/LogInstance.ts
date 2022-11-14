import {Source} from "../Source";
import LogEntry from "./LogEntry/LogEntry";

export default class LogInstance {
  
  public readonly title: string;
  
  private readonly source: Source;
  private readonly log_entry_list: LogEntry[];
  
  constructor(initializer: LogInstanceInitializer) {
    this.title = initializer.title;
    this.source = initializer.source;
    this.log_entry_list = initializer.log_entry_list ?? [];
  }
  
  public toString() {
    return "";
  }
  
  public toObject() {
    const collection = {} as {[key: string]: LogEntry};
    
    for (let entry of this.log_entry_list) {
      const key = entry.getUniqueKey();
      if (!collection[key]) {
        collection[key] = entry;
      }
      else {
        collection[key].incrementBy(entry);
      }
    }
    
    return collection;
  }
  
  public write(entry: LogEntry) {
    this.log_entry_list.push(entry);
  }
  
}

export interface LogInstanceInitializer {
  title: string;
  source: Source;
  log_entry_list?: LogEntry[];
}
