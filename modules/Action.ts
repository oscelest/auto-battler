import {Unit} from "../classes";
import Source from "../classes/Source/Source";
import {ActionEntity, ComboPointActionEntity, DamageActionEntity, HealActionEntity} from "../entities";
import ActionType from "../enums/Encounter/ActionType";
import DamageElementType from "../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../enums/Encounter/Damage/DamageSourceType";
import ModifierCategoryType from "../enums/Encounter/Modifier/ModifierCategoryType";
import SourceType from "../enums/Encounter/SourceType";
import Modifier from "./Modifier";

module Action {
  
  export function execute(action: ActionEntity, target_unit: Unit, source: Source): void {
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
  
  function executeDamage({modifier_list, source_type, element_type, direct}: DamageActionEntity, target_unit: Unit, source: Source): void {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    const value = Modifier.getCategoryValue(ModifierCategoryType.DAMAGE, modifier_list, source.unit);
    applyDamage(source, target_unit, value, source_type, element_type, direct);
  }
  
  function applyDamage(source: Source, target_unit: Unit, value: number, source_type: DamageSourceType, element_type: DamageElementType, direct: boolean, original_source: Source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyDamageTo(target_unit, value, source_type, element_type, direct, source);
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyDamageTo(target_unit, value, source_type, element_type, direct, source);
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyDamage(source.effect.source, target_unit, value, source_type, element_type, direct, original_source);
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyDamageTo(target_unit, value, source_type, element_type, direct, source);
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }
  
  function executeHeal({reviving, modifier_list}: HealActionEntity, target_unit: Unit, source: Source): void {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    const value = Modifier.getCategoryValue(ModifierCategoryType.HEAL, modifier_list, source.unit);
    applyHealing(source, target_unit, value, reviving);
  }
  
  function applyHealing(source: Source, target_unit: Unit, value: number, reviving: boolean, original_source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyHealingTo(target_unit, value, reviving, source);
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyHealingTo(target_unit, value, reviving, source);
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyHealing(source.effect.source, target_unit, value, reviving, original_source);
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyHealingTo(target_unit, value, reviving, source);
      
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }
  
  function executeComboPointAction({base_value, chainable, modifier_list}: ComboPointActionEntity, target_unit: Unit, source: Source): void {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    const value = Modifier.getCategoryValue(ModifierCategoryType.COMBO_POINT_CHANGE, modifier_list, source.unit) + base_value;
    applyComboPoint(source, target_unit, value, chainable);
  }
  
  function applyComboPoint(source: Source, target_unit: Unit, value: number, chainable: boolean, original_source: Source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit?.applyComboPointTo(target_unit, value, chainable);
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyComboPointTo(target_unit, value, chainable);
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyComboPoint(source.effect.source, target_unit, value, chainable, original_source);
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyComboPointTo(target_unit, value, chainable);
      
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }


}

export default Action;
