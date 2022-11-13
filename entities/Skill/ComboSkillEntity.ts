import SkillType from "../../enums/Encounter/SkillType";
import {SkillEntity, SkillEntityInitializer} from "./index";

export default class ComboSkillEntity extends SkillEntity {

  public combo_base: number;

  constructor(initializer: ComboSkillEntityInitializer) {
    super(SkillType.COMBO, initializer);
    this.combo_base = initializer.combo_base;
  }
}

export interface ComboSkillEntityInitializer extends SkillEntityInitializer {
  combo_base: number;
}
