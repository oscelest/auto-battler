import Source from "../Source";

export default class Log {
  
  private readonly log_lines: string[];
  private readonly log_handle_collection: {[key: string]: string[]};
  
  constructor(initializer: LogInitializer = {}) {
    this.log_lines = initializer.log_lines ?? [];
    this.log_handle_collection = initializer.log_handle_collection ?? {};
  }
  
  public toString() {
    return this.log_lines.join("\n");
  }
  
  public writeLine(message: string) {
    this.log_lines.push(message);
  }
  
  public writeBegin(source: Source) {
    if (this.log_handle_collection[source.id]) {
      console.warn(`Attempting to start writing to log from source with ID "${source.id}", but it already exists.`);
    }
    
    this.log_handle_collection[source.id] = [];
  }
  
  public writeFinish(source: Source) {
    if (!this.log_handle_collection[source.id]) {
      throw new Error(`Attempting to finish writing to log from source with ID "${source.id}", but it doesn't exist.`);
    }
    
    // TODO: Push new message to actual log
    this.log_lines.push(...this.log_handle_collection[source.id]);
    delete this.log_handle_collection[source.id];
  }
  
  public writeEntry(source: Source, message: string) {
    if (!this.log_handle_collection[source.id]) {
      console.log(source);
      throw new Error(`Attempting to write entry to log from source with ID "${source.id}", but it doesn't exist.`);
    }
    
    this.log_handle_collection[source.id].push(message);
  }
}

export interface LogInitializer {
  log_lines?: string[];
  log_handle_collection?: {[key: string]: string[]};
}
