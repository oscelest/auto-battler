import Source from "../Source/Source";
import LogEntry from "./LogEntry/LogEntry";
import LogInstance from "./LogInstance";

export default class Log {
  
  private readonly log_lines: string[];
  private readonly log_instance_collection: {[source_id: string]: LogInstance};
  
  constructor(initializer: LogInitializer = {}) {
    this.log_lines = initializer.log_lines ?? [];
    this.log_instance_collection = initializer.log_instance_collection ?? {};
  }
  
  public toString() {
    return this.log_lines.join("\n");
  }
  
  public writeLine(message: string) {
    this.log_lines.push(message);
  }
  
  public writeBegin(source: Source) {
    if (this.log_instance_collection[source.id]) {
      console.warn(`Attempting to start writing to log from source with ID "${source.id}", but it already exists.`);
    }
  
    this.log_instance_collection[source.id] = new LogInstance({source});
  }
  
  public writeFinish(source: Source) {
    if (!this.log_instance_collection[source.id]) {
      throw new Error(`Attempting to finish writing to log from source with ID "${source.id}", but it doesn't exist.`);
    }
    
    // TODO: Push new message to actual log
    this.log_lines.push(...this.log_instance_collection[source.id].toString());
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
  log_lines?: string[];
  log_instance_collection?: {[source_id: string]: LogInstance};
}
