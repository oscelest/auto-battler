import SkillType from "../../enums/Encounter/SkillType";
import {SkillEntity, SkillEntityInitializer} from "./index";

export default class ChargeSkillEntity extends SkillEntity {

  public charge_base: number;

  constructor(initializer: ChargeSkillEntityInitializer) {
    super(SkillType.CHARGE, initializer);
    this.charge_base = initializer.charge_base;
  }
}

export interface ChargeSkillEntityInitializer extends SkillEntityInitializer {
  charge_base: number;
}
