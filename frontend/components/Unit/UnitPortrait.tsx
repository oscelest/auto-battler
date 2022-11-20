import React, {HTMLAttributes} from "react";
import {ChargeSkill, ComboSkill, Skill, Unit} from "../../classes";
import {SkillType} from "../../generated/contract/enums/Discriminator/SkillType";
import {ModifierCategoryType} from "../../generated/contract/enums/Modifier/ModifierCategoryType";
import {UnitAttributeType} from "../../generated/contract/enums/Unit/UnitAttributeType";
import ComboBar from "../UI/ComboBar";
import ProgressBar from "../UI/ProgressBar";
import StatusEffectBar from "../UI/StatusEffectBar";
import Style from "./UnitPortrait.module.scss";

function UnitPortrait(props: UnitPortraitProps) {
  const {unit, className, ...component_props} = props;
  const {entity: {name}, health, effect_list} = unit;
  const max_health = unit.getAttributeValue(UnitAttributeType.HEALTH);
  
  const name_percent = 100;
  const name_background = "linear-gradient(to bottom, #673ab7, #512da8)";
  
  const health_percent = Math.min(Math.max(health / max_health * 100, 0), 100);
  const health_background = "linear-gradient(to bottom, #ed213a, #93291e)";
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      <StatusEffectBar>{effect_list}</StatusEffectBar>
      <ProgressBar className={Style.NameBar} percent={name_percent} background={name_background} column_left={name}/>
      <ProgressBar className={Style.HealthBar} percent={health_percent} background={health_background} column_left={`HP: ${Math.ceil(health)}`} column_right={`${health_percent.toFixed(1)}%`}/>
      <div className={Style.SkillList}>{unit.skill_list.map(renderSkill)}</div>
    </div>
  );
  
  function renderSkill(skill: Skill, index: number = 0) {
    switch (skill.entity.type) {
      case SkillType.CHARGE:
        const percentage = getChargePercentage(skill as ChargeSkill);
        const charge_background = "linear-gradient(to bottom, #00b4db, #0083b0)";
        return <ProgressBar key={index} className={Style.ChargeBar} percent={percentage}
                            background={charge_background} column_left={skill.entity.name} column_right={`${percentage.toFixed(0)}%`}/>;
  
      case SkillType.COMBO:
        // TODO: This is not the real min and max combo
        const {combo_point_current} = skill as ComboSkill;
        const combo_point_max = skill.getCategoryValue(ModifierCategoryType.COMBO_POINT_MAX);
        const combo_background = "linear-gradient(to top, #f12711, #f5af19)";
        return <ComboBar key={index} className={Style.ComboBar} current={combo_point_current} max={combo_point_max}
                         background={combo_background} column_left={skill.entity.name} column_right={`${combo_point_current} / ${combo_point_max}`}/>;
      default:
        return null;
    }
  }
  
  function getChargePercentage(skill: ChargeSkill) {
    const charge_max = skill.getCategoryValue(ModifierCategoryType.CHARGE_SKILL_MAX);
    return Math.min(Math.max(skill.charge_current / charge_max * 100, 0), 100);
  }
  
}

export interface UnitPortraitProps extends HTMLAttributes<HTMLDivElement> {
  unit: Unit;
}

export default UnitPortrait;
