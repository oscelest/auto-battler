import {Unit} from "../classes";
import Source from "../classes/Source/Source";
import {UnitComboPointAction, UnitDamageAction, UnitHealAction} from "../classes/Unit/Unit";
import {ActionEntity, ComboPointActionEntity, DamageActionEntity, EffectEntity, HealActionEntity} from "../entities";
import EffectActionEntity from "../entities/Action/EffectActionEntity";
import ActionType from "../enums/Encounter/ActionType";
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
        return executeComboPoint(action as ComboPointActionEntity, target_unit, source);
      case ActionType.EFFECT:
        return executeEffect(action as EffectActionEntity, target_unit, source);
    }
    throw new Error(`Action with type '${action.type}' doesn't exist.`);
  }
  
  function executeDamage({modifier_list, ...action}: DamageActionEntity, target_unit: Unit, source: Source): void {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    const applied_value = Modifier.getCategoryValue(ModifierCategoryType.DAMAGE, modifier_list, source.unit);
    applyDamage(source, target_unit, {...action, applied_value});
  }
  
  function applyDamage(source: Source, target_unit: Unit, action: UnitDamageAction, original_source: Source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyDamageTo(target_unit, action, original_source);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyDamageTo(target_unit, action, original_source);
      
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyDamage(source.effect.source, target_unit, action, original_source);
    
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyDamageTo(target_unit, action, original_source);
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }
  
  function executeHeal({modifier_list, ...action}: HealActionEntity, target_unit: Unit, source: Source): void {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    const applied_value = Modifier.getCategoryValue(ModifierCategoryType.HEAL, modifier_list, source.unit);
    applyHealing(source, target_unit, {...action, applied_value});
  }
  
  function applyHealing(source: Source, target_unit: Unit, action: UnitHealAction, original_source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyHealingTo(target_unit, action, original_source);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyHealingTo(target_unit, action, original_source);
      
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyHealing(source.effect.source, target_unit, action, original_source);
    
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyHealingTo(target_unit, action, original_source);
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }
  
  function executeComboPoint({modifier_list, base_value, ...action}: ComboPointActionEntity, target_unit: Unit, source: Source): void {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    const applied_value = Modifier.getCategoryValue(ModifierCategoryType.COMBO_POINT_CHANGE, modifier_list, source.unit) + base_value;
    applyComboPoint(source, target_unit, {...action, applied_value}, source);
  }
  
  function applyComboPoint(source: Source, target_unit: Unit, action: UnitComboPointAction, original_source: Source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit?.applyComboPointTo(target_unit, action, original_source);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyComboPointTo(target_unit, action, original_source);
      
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyComboPoint(source.effect.source, target_unit, action, original_source);
    
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyComboPointTo(target_unit, action, original_source);
    
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }
  
  export function executeEffect({effect, modifier_list}: EffectActionEntity, target_unit: Unit, source: Source) {
    modifier_list = Modifier.populateModifierList(source, [...modifier_list, ...effect.modifier_list]);
    
    const duration = Modifier.getCategoryValue(ModifierCategoryType.EFFECT_DURATION, modifier_list, source.unit);
    applyEffect(source, target_unit, effect, duration);
  }
  
  export function applyEffect(source: Source, target_unit: Unit, effect: EffectEntity, duration: number, original_source: Source = source): void {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyEffectTo(target_unit, effect, duration, original_source);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyEffectTo(target_unit, effect, duration, original_source);
      
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return applyEffect(source.effect.source, target_unit, effect, duration, original_source);
      
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyEffectTo(target_unit, effect, duration, original_source);
    }
  }
}

export default Action;
