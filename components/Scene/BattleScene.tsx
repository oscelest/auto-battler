import React, {HTMLAttributes} from "react";
import {Encounter, Unit} from "../../classes";
import UnitAlignmentType from "../../enums/Unit/UnitAlignmentType";
import UnitPortrait from "../Unit/UnitPortrait";
import Style from "./BattleScene.module.scss";

function BattleScene(props: BattleSceneProps) {
  const {battle, className, children, ...component_props} = props;
  if (!battle) return null;
  const enemy_unit_list = battle.unit_list.filter(unit => unit.alignment === UnitAlignmentType.ENEMY);
  const player_unit_list = battle.unit_list.filter(unit => unit.alignment === UnitAlignmentType.PLAYER);

  const classes = [Style.Component];
  if (className) classes.push(className);

  return (
    <div {...component_props} className={classes.join(" ")}>
      <div className={Style.EnemyList}>{enemy_unit_list.map(renderUnit)}</div>
      <div className={Style.PlayerList}>{player_unit_list.map(renderUnit)}</div>
    </div>
  );

  function renderUnit(unit: Unit, index: number = 0) {
    return (
      <UnitPortrait className={Style.Unit} key={index} unit={unit}/>
    );
  }

}


export interface BattleSceneProps extends HTMLAttributes<HTMLDivElement> {
  battle?: Encounter;
}

export default BattleScene;
