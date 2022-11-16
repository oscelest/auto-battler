import React, {CSSProperties, HTMLAttributes, useState} from "react";
import Style from "./Countdown.module.scss";

function Countdown(props: CountdownProps) {
  const {duration, className, children, ...component_props} = props;
  const [start_duration] = useState<number>(duration);
  
  const path = [] as string[];
  if (start_duration > 0) {
    const degrees = (1 - (duration / start_duration)) * 360;
  
    path.push("50% 50%");
    path.push("50% 0%");
  
    if (degrees >= 45) {
      path.push(`100% 0%`);
    }
    else {
      path.push(`${(degrees / 45) * 50 + 50}% 0%`);
    }
  
    if (degrees >= 135) {
      path.push(`100% 100%`);
    }
    else if (degrees > 45) {
      path.push(`100% ${((degrees - 45) / 90) * 100}%`);
    }
  
    if (degrees >= 225) {
      path.push(`0% 100%`);
    }
    else if (degrees > 135) {
      path.push(`${(1 - ((degrees - 135) / 90)) * 100}% 100%`);
    }
  
    if (degrees >= 315) {
      path.push(`0% 0%`);
      path.push(`${((degrees - 315) / 45) * 50}% 0%`);
    }
    else if (degrees > 225) {
      path.push(`0% ${(1 - ((degrees - 225) / 90)) * 100}%`);
    }
  
    path.push("50% 50%");
  }
  const fill_style = path.length ? {clipPath: `polygon(${path.join(",")})`} as CSSProperties : undefined;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      <div className={Style.Fill} style={fill_style}/>
      {children}
    </div>
  );
  
}

export interface CountdownProps extends HTMLAttributes<HTMLDivElement> {
  duration: number;
}

export default Countdown;
