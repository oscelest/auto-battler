import LogEntry from "./LogEntry/LogEntry";
import LogSection from "./LogSection";

export default class LogInstance {
  
  private readonly log_entry_list: LogEntry[];
  
  constructor(initializer: LogInstanceInitializer = {}) {
    this.log_entry_list = initializer.log_entry_list ?? [];
  }
  
  public toLogSection(title: string) {
    const entry_collection = {} as {[key: string]: EntryCollection};
    for (let entry of this.log_entry_list) {
      const key = entry.getUniqueKey();
      
      if (!entry_collection[key]) {
        entry_collection[key] = {
          main_entry: LogEntry.instantiateEmpty(entry.type, entry),
          entry_list: []
        };
      }
      
      entry_collection[key].main_entry.incrementBy(entry);
      entry_collection[key].entry_list.push(entry);
    }
    
    const section_list = [] as LogSection[];
    for (let collection of Object.values(entry_collection)) {
      const title = collection.main_entry.toString();
      const section = new LogSection({title});
      if (!collection.main_entry.periodic && collection.entry_list.length > 1) {
        const sub_section_list = collection.entry_list.map(entry => entry.toLogSection());
        section.section_list.push(...sub_section_list);
      }
      section_list.push(section);
    }
    
    
    return new LogSection({title, section_list});
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
  log_entry_list?: LogEntry[];
}
