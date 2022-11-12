import {v4} from "uuid";
import {ModifierEntity} from "../Modifier";

export default class UnitClassEntity {

  public id: string;
  public name: string;
  public modifier_list: ModifierEntity[];

  constructor(initializer: UnitClassEntityInitializer) {
    this.id = initializer.id ?? v4();
    this.name = initializer.name;
    this.modifier_list = initializer.modifier_list;
  }
}

export interface UnitClassEntityInitializer {
  id?: string;
  name: string;
  modifier_list: ModifierEntity[];
}
