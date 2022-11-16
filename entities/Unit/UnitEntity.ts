import {v4} from "uuid";
import {ModifierEntity} from "../Modifier";
import {SkillEntity} from "../Skill";
import {UnitClassEntity} from "./index";

export default class UnitEntity {
  
  public id: string;
  public name: string;
  public class: UnitClassEntity;
  public experience: number;
  public skill_list: SkillEntity[];
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: UnitEntityInitializer) {
    this.id = initializer.id ?? v4();
    this.name = initializer.name;
    this.class = initializer.class;
    this.experience = initializer.experience ?? 0;
    this.skill_list = initializer.skill_list ?? [];
    this.modifier_list = initializer.modifier_list ?? [];
  }
}

export interface UnitEntityInitializer {
  id?: string;
  name: string;
  class: UnitClassEntity;
  experience?: number;
  skill_list?: SkillEntity[];
  modifier_list?: ModifierEntity[];
}
