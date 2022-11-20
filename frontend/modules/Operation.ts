import {Unit} from "../classes";
import Source from "../classes/Source/Source";
import {SourceType} from "../enums";
import {ModifierEntity} from "../generated/contract/entities/Modifier/Modifier.entity";
import {OperationEntity} from "../generated/contract/entities/Operation/Operation.entity";
import {TargetType} from "../generated/contract/enums/TargetType";
import Action from "./Action";
import Modifier from "./Modifier";

module Operation {
  
  export function execute(operation: OperationEntity, self_unit: Unit, source: Source) {
    const target_list = getTargetList(source, operation.target, operation.modifier_list, self_unit);
    for (let target_unit of target_list) {
      for (let action of operation.action_list) {
        Action.execute(action, target_unit, source);
      }
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
