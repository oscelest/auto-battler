import React, {HTMLAttributes} from "react";
import {Encounter, Unit} from "../../classes";
import {UnitAlignmentType} from "../../enums";
import CombatLog from "../UI/Encounter/CombatLog/CombatLog";
import UnitPortrait from "../Unit/UnitPortrait";
import Style from "./EncounterScene.module.scss";

function EncounterScene(props: EncounterSceneProps) {
  const {encounter, className, children, ...component_props} = props;
  
  const enemy_unit_list = encounter.unit_list.filter(unit => unit.alignment === UnitAlignmentType.ENEMY);
  const player_unit_list = encounter.unit_list.filter(unit => unit.alignment === UnitAlignmentType.PLAYER);
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      <div className={Style.Field}>
        <div className={Style.EnemyList}>{enemy_unit_list.map(renderUnit)}</div>
        <div className={Style.PlayerList}>{player_unit_list.map(renderUnit)}</div>
      </div>
      <CombatLog className={Style.CombatLog} log={encounter.log}></CombatLog>
    </div>
  );
  
  function renderUnit(unit: Unit, index: number = 0) {
    return (
      <UnitPortrait className={Style.Unit} key={index} unit={unit}/>
    );
  }
  
}

export interface EncounterSceneProps extends HTMLAttributes<HTMLDivElement> {
  encounter: Encounter;
}

export default EncounterScene;
