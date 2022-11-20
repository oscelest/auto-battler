import {CoreEntity} from "../Core.entity";
import {SkillEntity} from "../Skill/Skill.entity";
import {UnitClassEntity} from "./UnitClass.entity";

export interface UnitEntity extends CoreEntity {
  name: string;
  class: UnitClassEntity;
  experience: number;
  skill_list: SkillEntity[];
}

export function isUnitEntity(object: any): object is UnitEntity {
  return "entity" in object;
}
