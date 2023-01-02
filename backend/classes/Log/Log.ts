import Source from "../Source/Source";
import LogEntry from "./LogEntry/LogEntry";
import LogInstance from "./LogInstance";
import LogSection from "./LogSection";

export default class Log {
  
  public readonly log_section_list: LogSection[];
  public readonly log_instance_collection: {[source_id: string]: LogInstance};
  
  constructor(initializer: LogInitializer = {}) {
    this.log_section_list = initializer.log_section_list ?? [];
    this.log_instance_collection = initializer.log_instance_collection ?? {};
  }
  
  public toString() {
    return this.log_section_list.join("\n");
  }
  
  public writeLine(title: string) {
    this.log_section_list.push(new LogSection({title}));
  }
  
  public writeBegin(source: Source) {
    if (this.log_instance_collection[source.id]) {
      console.warn(`Attempting to start writing to log from source with ID "${source.id}", but it already exists.`);
    }
    
    this.log_instance_collection[source.id] = new LogInstance();
  }
  
  public writeEnd(source: Source, title: string) {
    if (!this.log_instance_collection[source.id]) {
      throw new Error(`Attempting to finish writing to log from source with ID "${source.id}", but it doesn't exist.`);
    }
    
    this.log_section_list.push(this.log_instance_collection[source.id].toLogSection(title));
    delete this.log_instance_collection[source.id];
  }
  
  public writeEntry(source: Source, entry: LogEntry) {
    if (!this.log_instance_collection[source.id]) {
      throw new Error(`Attempting to write entry to log from source with ID "${source.id}", but it doesn't exist.`);
    }
    
    this.log_instance_collection[source.id].write(entry);
  }
}

export interface LogInitializer {
  log_section_list?: LogSection[];
  log_instance_collection?: {[source_id: string]: LogInstance};
}