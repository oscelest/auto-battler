import SkillEffectEntity from "../../entities/Effect/SkillEffectEntity";
import {Unit} from "../Unit";
import Effect, {EffectInitializer} from "./Effect";

export default class SkillEffect extends Effect<SkillEffectEntity> {

  public skill_unit: Unit;

  constructor(initializer: SkillEffectInitializer) {
    super(initializer);

    this.skill_unit = initializer.skill_unit;
  }

}

export interface SkillEffectInitializer extends EffectInitializer<SkillEffectEntity> {
  skill_unit: Unit;
}
