export default class LogSection {
  
  public title: string;
  public section_list: LogSection[];
  
  private static indent = 2;
  private static character = "↳";
  
  constructor(initializer: LogSectionInitializer) {
    this.title = initializer.title;
    this.section_list = initializer.section_list ?? [];
  }
  
  public toString(level: number = 1): string {
    if ((this.section_list.length && level === 1) || this.section_list.length > 1) {
      const indent = level * LogSection.indent;
      const entries = this.section_list.map(entry => `${LogSection.character} ${entry.toString(level + 1)}`.padStart(indent, " "));
      return `${this.title}\n${entries.join("\n")}`;
    }
    return `${this.title}`;
  }
  
}

export interface LogSectionInitializer {
  title: string;
  section_list?: LogSection[];
}
