import {Unit} from "../classes";
import Source from "../classes/Source";
import {EffectEntity, ModifierEntity, OperationEntity} from "../entities";
import ModifierCategoryType from "../enums/Modifier/ModifierCategoryType";
import SourceType from "../enums/SourceType";
import TargetType from "../enums/TargetType";
import Action from "./Action";
import Modifier from "./Modifier";

module Operation {
  
  export function execute(operation: OperationEntity, self_unit: Unit, source: Source) {
    const target_list = getTargetList(source, operation.target, operation.modifier_list, self_unit);
    for (let target_unit of target_list) {
      for (let effect of operation.effect_list) {
        executeEffect(effect, target_unit, source);
      }
      for (let action of operation.action_list) {
        Action.execute(action, target_unit, source);
      }
    }
  }
  
  export function executeEffect(effect: EffectEntity, target_unit: Unit, source: Source) {
    const modifier_list = Modifier.populateModifierList(source, effect.modifier_list);
    
    const duration = Modifier.getCategoryValue(ModifierCategoryType.EFFECT_DURATION, modifier_list, source.unit);
    applyEffect(source, target_unit, effect, duration);
  }
  
  export function applyEffect(source: Source, target_unit: Unit, effect: EffectEntity, duration: number) {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.applyEffectTo(target_unit, effect, duration, source);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.applyEffectTo(target_unit, effect, duration, source);
      
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.applyEffectTo(target_unit, effect, duration, source);
    }
  }
  
  function getTargetList(source: Source, target_type: TargetType, modifier_list: ModifierEntity[], self_unit: Unit) {
    modifier_list = Modifier.populateModifierList(source, modifier_list);
    
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return source.unit.encounter.getTargetList(target_type, modifier_list, self_unit, source);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return source.skill.unit.encounter.getTargetList(target_type, modifier_list, self_unit, source);
      
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return source.effect.unit.encounter.getTargetList(target_type, modifier_list, self_unit, source);
      
      case SourceType.ENCOUNTER:
        if (!source.encounter) throw new Error();
        return source.encounter.getTargetList(target_type, modifier_list, self_unit, source);
    }
  }
}

export default Operation;
