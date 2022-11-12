import {v4} from "uuid";

export default abstract class Element {

  public id: string;

  protected constructor(initializer: ElementInitializer) {
    this.id = initializer.id ?? v4();
  }
}

export interface ElementInitializer {
  id?: string;
}
