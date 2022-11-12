import React from "react";
import {Effect} from "../../classes";
import Countdown from "../UI/Countdown";
import Style from "./StatusEffectIcon.module.scss";

function EffectIcon(props: EffectIconProps) {
  const {status_effect} = props;
  const {duration} = status_effect;

  return (
    <div className={Style.Component}>
      <Countdown className={Style.Countdown} duration={duration ?? 0}>
        <div className={Style.Icon}>
          🤩
        </div>
      </Countdown>
    </div>
  );

}

export interface EffectIconProps {
  status_effect: Effect;
}

export default EffectIcon;
