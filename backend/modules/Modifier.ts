import {Unit} from "../classes";
import Source from "../classes/Source/Source";
import {SourceType} from "../enums";
import {ArithmeticalModifierEntity, ArithmeticalType, AttributeModifierEntity, AttributeType, ModifierCategoryType, ModifierEntity, ModifierType} from "../gql/sdk";

module Modifier {
  
  const fromAttributeToCategoryMap = {
    [AttributeType.Health]: ModifierCategoryType.UnitAttributeHealth,
    [AttributeType.AttackPower]: ModifierCategoryType.UnitAttributeAttackPower,
    [AttributeType.SpellPower]: ModifierCategoryType.UnitAttributeSpellPower
  };
  
  export function populateModifierList(source: Source, modifier_list: ModifierEntity[] = []): ModifierEntity[] {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return [...modifier_list, ...source.unit.modifier_list];
      
      case SourceType.EFFECT:
        if (!source.effect) throw new Error();
        return populateModifierList(source.effect.source, [...source.effect.modifier_list, ...modifier_list]);
      
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return [...modifier_list, ...source.skill.modifier_list, ...source.skill.unit.modifier_list];
      
      case SourceType.ENCOUNTER:
        return modifier_list;
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }
  
  export function convertAttributeToCategory(attribute: AttributeType): ModifierCategoryType {
    return fromAttributeToCategoryMap[attribute];
  }
  
  export function getCategoryValue(category_list: ModifierCategoryType | ModifierCategoryType[], modifier_list: ModifierEntity[], unit?: Unit) {
    category_list = Array.isArray(category_list) ? category_list : [category_list];
  
    let additive: number = 0, multiplicative: number = 1, exponential: number = 1;
    for (let modifier of modifier_list) {
      if (!category_list.includes(modifier.category)) continue;
      
      const {value, value_per_level} = modifier as AttributeModifierEntity;
      const total_value = value + value_per_level * (unit?.level ?? 0);
  
      if (modifier.type === ModifierType.Attribute) {
        if (!unit) continue;
        const {attribute} = modifier as AttributeModifierEntity;
        additive += unit.getAttributeValue(attribute) * total_value;
      }
      else {
        const {arithmetical} = modifier as ArithmeticalModifierEntity;
        if (arithmetical === ArithmeticalType.Additive) {
          additive += total_value;
        }
        else if (arithmetical === ArithmeticalType.Multiplicative) {
          multiplicative += total_value;
        }
        else {
          exponential *= total_value;
        }
      }
    }
  
    return Math.max(0, additive * multiplicative * exponential);
  }
  
}

export default Modifier;
