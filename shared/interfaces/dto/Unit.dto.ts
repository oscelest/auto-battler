import {EffectDTO} from "./Effect.dto";
import {SkillDTO} from "./Skill.dto";
import {UnitTypeDTO} from "./UnitType.dto";

export interface UnitDTO {
  id: string;
  name: string;
  type: UnitTypeDTO;
  skill_list: SkillDTO[];
  effect_list: EffectDTO[];
  
}
