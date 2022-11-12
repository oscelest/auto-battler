import {Unit} from "../classes";
import Source from "../classes/Source";
import {ActionEntity, ComboPointActionEntity, DamageActionEntity, HealActionEntity} from "../entities";
import ActionType from "../enums/ActionType";
import DamageElementType from "../enums/Damage/DamageElementType";
import DamageSourceType from "../enums/Damage/DamageSourceType";
import ModifierCategory from "../enums/Modifier/ModifierCategory";
import SourceType from "../enums/SourceType";
import Modifier from "./Modifier";

module Action {

  export function execute(action: ActionEntity, target_unit: Unit, source: Source) {
    switch (action.type) {
      case ActionType.DAMAGE:
        return executeDamage(action as DamageActionEntity, target_unit, source);
      case ActionType.HEAL:
        return executeHeal(action as HealActionEntity, target_unit, source);
      case ActionType.COMBO_POINT:
        return executeComboPointAction(action as ComboPointActionEntity, target_unit, source);
    }
    throw new Error(`Action with type '${action.type}' doesn't exist.`);
  }

  function executeDamage({modifier_list, source_type, element_type, direct}: DamageActionEntity, target_unit: Unit, source: Source) {
    modifier_list = Modifier.populateModifierList(source, modifier_list);

    const pre_mitigation_value = Modifier.getCategoryValue(ModifierCategory.DAMAGE, modifier_list, source.unit);
    const post_mitigation_value = applyDamage(source, target_unit, pre_mitigation_value, source_type, element_type, direct);
  }

  function applyDamage(source: Source, target_unit: Unit, value: number, source_type: DamageSourceType, element_type: DamageElementType, direct: boolean) {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyDamageTo(target_unit, value, source_type, element_type, direct);
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyDamageTo(target_unit, value, source_type, element_type, direct);
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyDamageTo(target_unit, value, source_type, element_type, direct);
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }

  function executeHeal({reviving, modifier_list}: HealActionEntity, target_unit: Unit, source: Source) {
    modifier_list = Modifier.populateModifierList(source, modifier_list);

    const pre_mitigation_value = Modifier.getCategoryValue(ModifierCategory.HEAL, modifier_list, source.unit);
    const post_mitigation_value = applyHealing(source, target_unit, pre_mitigation_value, reviving);
  }

  function applyHealing(source: Source, target_unit: Unit, value: number, reviving: boolean) {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyHealingTo(target_unit, value, reviving);
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyHealingTo(target_unit, value, reviving);
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyHealingTo(target_unit, value, reviving);
        ;
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }

  function executeComboPointAction({base_value, chainable, modifier_list}: ComboPointActionEntity, target_unit: Unit, source: Source) {
    modifier_list = Modifier.populateModifierList(source, modifier_list);

    const pre_mitigation_value = Modifier.getCategoryValue(ModifierCategory.COMBO_POINT_CHANGE, modifier_list, source.unit) + base_value;
    const post_mitigation_value = applyComboPoint(source, target_unit, pre_mitigation_value, chainable);
  }

  function applyComboPoint(source: Source, target_unit: Unit, value: number, chainable: boolean) {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit?.applyComboPointTo(target_unit, value, chainable);
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyComboPointTo(target_unit, value, chainable);
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyComboPointTo(target_unit, value, chainable);

    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }


}

export default Action;
