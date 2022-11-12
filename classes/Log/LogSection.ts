export default class LogSection {

  private static indent = "    ";
  public readonly title: string;
  public readonly line_list: string[];

  constructor(initializer: LogSectionInitializer) {
    this.title = initializer.title;
    this.line_list = initializer.line_list ?? [];
  }

  public writeLine(line: string) {
    this.line_list.push(line);
  }

  public toString() {
    return this.line_list.length ? `${this.title}\n${this.line_list.map(line => `${LogSection.indent}${line.trim()}`).join("\n")}` : this.title;
  }

}

export interface LogSectionInitializer {
  title: string;
  line_list?: string[];
}
