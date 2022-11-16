import React, {HTMLAttributes} from "react";
import Style from "./ColumnSection.module.scss";

function ColumnSection(props: ColumnSectionProps) {
  const {children_left, children_right, className, children, ...component_props} = props;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      <div className={Style.Left}>
        {children_left}
      </div>
      {renderCenter()}
      <div className={Style.Right}>
        {children_right}
      </div>
    </div>
  );
  
  function renderCenter() {
    if (!children) return null;
    
    return (
      <div className={Style.Center}>
        {children}%
      </div>
    );
  }
}

export interface ColumnSectionProps extends HTMLAttributes<HTMLDivElement> {
  children_left?: React.ReactNode;
  children_right?: React.ReactNode;
}

export default ColumnSection;
