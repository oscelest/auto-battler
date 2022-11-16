import LogEntry from "./LogEntry/LogEntry";
import LogSection from "./LogSection";

export default class LogInstance {
  
  public readonly title: string;
  
  private readonly log_entry_list: LogEntry[];
  
  constructor(initializer: LogInstanceInitializer) {
    this.title = initializer.title;
    this.log_entry_list = initializer.log_entry_list ?? [];
  }
  
  public toLogSection() {
    const entry_collection = {} as {[key: string]: EntryCollection};
    for (let entry of this.log_entry_list) {
      const key = entry.getUniqueKey();
      if (!entry_collection[key]) {
        entry_collection[key] = {main_entry: LogEntry.instantiateEmpty(entry.type, entry), entry_list: []};
      }
      entry_collection[key].main_entry.incrementBy(entry);
      if (!entry.periodic) {
        entry_collection[key].entry_list.push(entry);
      }
    }
    
    const entry_list = [] as LogSection[];
    for (let entry of Object.values(entry_collection)) {
      entry_list.push(new LogSection({
        title: entry.main_entry.toString(),
        entry_list: entry.entry_list
      }));
    }
    
    return new LogSection({title: this.title, entry_list});
  }
  
  public write(entry: LogEntry) {
    this.log_entry_list.push(entry);
  }
  
}

interface EntryCollection {
  main_entry: LogEntry;
  entry_list: LogEntry[];
}

export interface LogInstanceInitializer {
  title: string;
  log_entry_list?: LogEntry[];
}
