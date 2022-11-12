import {LogSection} from "./index";

export default class Log {

  private readonly section_list: LogSection[];

  constructor(initializer: LogInitializer = {}) {
    this.section_list = initializer.section_list ?? [];
  }

  public toString() {
    return this.section_list.join("\n");
  }

  public write(section: LogSection) {
    this.section_list.push(section);
  }

  public writeLine(title: string) {
    this.section_list.push(new LogSection({title}));
  }

  public writeSection(title: string, line_list?: string[]) {
    this.section_list.push(new LogSection({title, line_list}));
  }
}

export interface LogInitializer {
  section_list?: LogSection[];
}
