import {Unit} from "../classes";
import Source from "../classes/Source";
import {ModifierEntity, NumericalModifierEntity} from "../entities";
import AttributeModifierEntity from "../entities/Modifier/AttributeModifierEntity";
import ModifierCategory from "../enums/Modifier/ModifierCategory";
import ModifierNumericalType from "../enums/Modifier/ModifierNumericalType";
import ModifierType from "../enums/Modifier/ModifierType";
import SourceType from "../enums/SourceType";
import UnitAttributeType from "../enums/Unit/UnitAttributeType";

module Modifier {

  export const fromAttributeToCategoryMap = {
    [UnitAttributeType.HEALTH]: ModifierCategory.UNIT_ATTRIBUTE_HEALTH,
    [UnitAttributeType.ATTACK_POWER]: ModifierCategory.UNIT_ATTRIBUTE_ATTACK_POWER,
    [UnitAttributeType.SPELL_POWER]: ModifierCategory.UNIT_ATTRIBUTE_SPELL_POWER
  };

  export function populateModifierList(source: Source, modifier_list: ModifierEntity[] = []) {
    switch (source.type) {
      case SourceType.UNIT:
        if (!source.unit) throw new Error();
        return [...modifier_list, ...source.unit.getModifierList()];
      case SourceType.SKILL:
        if (!source.skill) throw new Error();
        return [...modifier_list, ...source.skill.getModifierList(), ...source.skill.unit.getModifierList()];
      case SourceType.ENCOUNTER:
        return modifier_list;
    }
    throw new Error(`Source with type '${source.type}' doesn't exist.`);
  }

  export function getCategoryValue(category_list: ModifierCategory | ModifierCategory[], modifier_list: ModifierEntity[], unit?: Unit) {
    category_list = Array.isArray(category_list) ? category_list : [category_list];

    let flat: number = 0, additive: number = 1, multiplicative: number = 1;
    for (let modifier of modifier_list) {
      if (!category_list.includes(modifier.category)) continue;

      const {value, value_per_level} = modifier as AttributeModifierEntity;
      const total_value = value + value_per_level * (unit?.getLevel() ?? 0);
      if (modifier.type === ModifierType.ATTRIBUTE) {
        if (!unit) continue;
        const {attribute} = modifier as AttributeModifierEntity;
        flat += unit.getAttributeValue(attribute) * total_value;
      }
      else {
        const {numerical_type} = modifier as NumericalModifierEntity;
        if (numerical_type === ModifierNumericalType.FLAT) {
          flat += total_value;
        }
        else if (numerical_type === ModifierNumericalType.ADDITIVE) {
          additive += total_value;
        }
        else {
          multiplicative *= total_value;
        }
      }
    }

    return Math.max(0, flat * additive * multiplicative);
  }

}

export default Modifier;
