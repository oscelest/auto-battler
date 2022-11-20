import React, {HTMLAttributes} from "react";
import {IconType} from "../../enums";
import Style from "./Icon.module.scss";

function Icon<V = any>(props: IconProps<V>) {
  const {className, type, value, ...component_props} = props;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")} onClick={onClick}>
      {type}
    </div>
  );
  
  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented) return;
    props.onClick?.(event, props.value);
    
    invokeEvent(event, props.onClick);
  }
  
  function invokeEvent(event: React.SyntheticEvent, callback?: (...args: any[]) => any | Promise<any>) {
    return hasProperty(props, "value") ? callback?.(props.value, event) : callback?.(event);
  }
  
  function hasProperty<O extends object>(object: O, key: keyof O) {
    return object.hasOwnProperty(key);
  }
}

export interface IconProps<V = any> extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  type: IconType;
  value?: V;
  
  onClick?(event: React.MouseEvent<HTMLDivElement>, value?: V): any | Promise<any>;
}

export default Icon;
