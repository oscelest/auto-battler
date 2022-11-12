import React, {HTMLAttributes} from "react";
import {Effect} from "../../classes";
import StatusEffectAlignment from "../../enums/StatusEffect/StatusEffectAlignment";
import Countdown from "./Countdown";
import Style from "./StatusEffectBar.module.scss";

function StatusEffectBar(props: StatusEffectBarProps) {
  const {className, children, ...component_props} = props;

  const collection = Effect.getStatusEffectAlignmentCollection(children);

  const classes = [Style.Component];
  if (className) classes.push(className);

  if (!collection[StatusEffectAlignment.NEUTRAL].length && !collection[StatusEffectAlignment.NEGATIVE].length && !collection[StatusEffectAlignment.POSITIVE].length) {
    return null;
  }

  return (
    <div {...component_props} className={classes.join(" ")}>
      {renderList(collection[StatusEffectAlignment.NEUTRAL])}
      {renderList(collection[StatusEffectAlignment.NEGATIVE])}
      {renderList(collection[StatusEffectAlignment.POSITIVE])}
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
      const status_effect = list[0];
      return (
        <div key={index} className={Style.StatusEffect}>
          <Countdown className={Style.Countdown} duration={status_effect.duration ?? 0}>
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
