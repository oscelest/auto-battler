import React, {HTMLAttributes} from "react";
import {Effect} from "../../classes";
import EffectAlignmentType from "../../enums/Encounter/Effect/EffectAlignmentType";
import Countdown from "./Countdown";
import Style from "./StatusEffectBar.module.scss";

function StatusEffectBar(props: StatusEffectBarProps) {
  const {className, children, ...component_props} = props;

  const collection = Effect.getStatusEffectAlignmentCollection(children);

  const classes = [Style.Component];
  if (className) classes.push(className);
  
  if (!collection[EffectAlignmentType.NEUTRAL].length && !collection[EffectAlignmentType.NEGATIVE].length && !collection[EffectAlignmentType.POSITIVE].length) {
    return null;
  }

  return (
    <div {...component_props} className={classes.join(" ")}>
      {renderList(collection[EffectAlignmentType.NEUTRAL])}
      {renderList(collection[EffectAlignmentType.NEGATIVE])}
      {renderList(collection[EffectAlignmentType.POSITIVE])}
    </div>
  );

  function renderList(list: Effect[]) {
    if (!list.length) return null;

    const collection = Object.values(Effect.getStatusEffectStackCollection(list));
    return (
      <div className={Style.List}>
        {collection.map(renderStatusEffectIcon)}
      </div>
    );
  }

  function renderStatusEffectIcon(list: Effect[], index: number = 0) {
    if (list.length === 1) {
      const effect = list[0];
      const remaining_duration = effect.duration - effect.duration_elapsed;
      return (
        <div key={index} className={Style.StatusEffect}>
          <Countdown className={Style.Countdown} duration={remaining_duration}>
            <div className={Style.Icon}>
              ⚔
            </div>
          </Countdown>
        </div>
      );
    }

    return (
      <div key={index} className={Style.StatusEffect}>
        <div className={Style.Icon}>
          ⚔
        </div>
        <div className={Style.Stack}>x{list.length}</div>
      </div>
    );
  }


}

export interface StatusEffectBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: Effect[];
}

export default StatusEffectBar;
