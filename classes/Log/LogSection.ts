import {LogEntry} from "./LogEntry";

export default class LogSection {
  
  public title: string;
  public entry_list: (LogEntry | LogSection)[];
  
  private static indent = 2;
  private static character = "↳";
  
  constructor(initializer: LogSectionInitializer) {
    this.title = initializer.title;
    this.entry_list = initializer.entry_list ?? [];
  }
  
  public toString(level: number = 1): string {
    if ((this.entry_list.length && level === 1) || this.entry_list.length > 1) {
      const indent = level * LogSection.indent;
      const entries = this.entry_list.map(entry => `${LogSection.character} ${entry instanceof LogSection ? entry.toString(level + 1) : entry}`.padStart(indent, " "));
      return `${this.title}\n${entries.join("\n")}`;
    }
    return `${this.title}`;
  }
  
}

export interface LogSectionInitializer {
  title: string;
  entry_list?: (LogEntry | LogSection)[];
}
