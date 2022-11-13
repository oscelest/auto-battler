import {ComboSkillEntity} from "../../entities";
import {SkillEventType, UnitEventType} from "../../enums";
import ModifierCategoryType from "../../enums/Encounter/Modifier/ModifierCategoryType";
import Modifier from "../../modules/Modifier";
import {UnitComboPointEvent} from "../Unit/Unit";
import Skill, {SkillInitializer} from "./Skill";

export default class ComboSkill extends Skill<ComboSkillEntity> {

  public combo_point_current: number;

  constructor(initializer: ComboSkillInitializer) {
    super(initializer);
    this.combo_point_current = initializer.combo_current ?? 0;

    this.unit.on(UnitEventType.COMBO_POINT_APPLIED, this.onUnitComboPointApplied);
    this.unit.on(UnitEventType.KILLED, this.onUnitKilled);
    this.unit.on(UnitEventType.REVIVE_RECEIVED, this.onUnitRevived);
  }

  private readonly onUnitComboPointApplied = ({delta, source, chainable, target_unit}: UnitComboPointEvent) => {
    this.combo_point_current += delta;
    const modifier_list = [...this.modifier_list, ...target_unit.modifier_list];
    const combo_point_max = Modifier.getCategoryValue(ModifierCategoryType.COMBO_POINT_MAX, modifier_list, target_unit);

    if (this.combo_point_current >= combo_point_max) {
      const combo_point_retain = Modifier.getCategoryValue(ModifierCategoryType.COMBO_POINT_RETAIN, modifier_list, target_unit);
      const combo_point_value = Math.min(combo_point_retain, combo_point_max - 1);
      this.trigger(SkillEventType.USE, {skill: this});
      if (combo_point_value > 0) target_unit.applyComboPointTo(target_unit, combo_point_value, false);
    }
  };

  private onUnitKilled = () => {
    this.unit.off(UnitEventType.COMBO_POINT_APPLIED, this.onUnitComboPointApplied);
  };

  private onUnitRevived = () => {
    this.unit.on(UnitEventType.COMBO_POINT_APPLIED, this.onUnitComboPointApplied);
  };

}

export interface ComboSkillInitializer extends SkillInitializer<ComboSkillEntity> {
  combo_current?: number;
}
