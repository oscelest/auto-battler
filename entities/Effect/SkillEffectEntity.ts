import EffectType from "../../enums/EffectType";
import {SkillEntity} from "../Skill";
import {EffectEntityInitializer} from "./EffectEntity";
import {EffectEntity} from "./index";

export default class SkillEffectEntity extends EffectEntity {

  public skill: SkillEntity;

  constructor(initializer: SkillEffectEntityInitializer) {
    super(EffectType.SKILL, initializer);

    this.skill = initializer.skill;
  }
}

export interface SkillEffectEntityInitializer extends EffectEntityInitializer {
  skill: SkillEntity;
}
